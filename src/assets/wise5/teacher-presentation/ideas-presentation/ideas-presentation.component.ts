import { Component, Input, OnInit, OnChanges, inject, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TeacherPresentationSelectionStore } from '../state/teacher-presentation-selection.store';
import { IdeasPresentationResponse, StudentNamesDisplayMode } from '../models/teacher-presentation-config';
import { CRaterService } from '../../services/cRaterService';
import { ConfigService } from '../../services/configService';
import { CRaterRubric } from '../../components/common/cRater/CRaterRubric';
import { branchPathBackgroundColors } from '../../common/color/color';
import { getAvatarColorForWorkgroupId } from '../../common/workgroup/workgroup';
import { StudentResponseItem } from '../../directives/teacher-summary-display/ideas-summary/ideas-summary.component';

export interface PresentedIdeaSection {
  ideaId: string | null;
  ideaText?: string;
  responses: StudentResponseItem[];
}

@Component({
  selector: 'ideas-presentation',
  imports: [CommonModule, MatIconModule],
  templateUrl: './ideas-presentation.component.html'
})
export class IdeasPresentationComponent implements OnInit, OnChanges {
  @Input() nodeId: string;
  @Input() component: any;
  @Input() periodId: number;
  @Input() store: TeacherPresentationSelectionStore;
  @Input() studentNamesDisplayMode: StudentNamesDisplayMode = 'hide';

  protected presentedSections: PresentedIdeaSection[] = [];
  protected rubric: CRaterRubric;
  protected workgroups: any[] = [];

  private configService = inject(ConfigService);
  private cRaterService = inject(CRaterService);

  get componentId(): string {
    return this.component?.id || '';
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nodeId || changes.component || changes.periodId) {
      this.loadData();
    }
  }

  loadData(): void {
    if (!this.nodeId || !this.componentId) return;
    this.rubric = this.cRaterService.getCRaterRubric(this.nodeId, this.componentId);
    this.workgroups = this.configService.getClassmateUserInfos() ?? [];
    this.buildSections();
  }

  /**
   * Sections are built from the response snapshots saved with the selection, so presentation does
   * not depend on re-loading student work or re-running idea detection.
   */
  private buildSections(): void {
    const sections: PresentedIdeaSection[] = [];
    const responseMap = this.store.selectedIdeaResponseMap();
    this.store.selectedIdeaIds().forEach((ideaId) => {
      sections.push({
        ideaId,
        ideaText: this.rubric?.getIdeaDescriptionText(ideaId) ?? ideaId,
        responses: this.toItems(responseMap.get(ideaId)?.values())
      });
    });
    const standalone = this.toItems(this.store.standaloneResponses().values());
    standalone.forEach((response) => {
      sections.push({ ideaId: null, responses: [response] });
    });
    this.presentedSections = sections;
  }

  private toItems(
    responses: Iterable<IdeasPresentationResponse> | undefined
  ): StudentResponseItem[] {
    return Array.from(responses ?? [])
      .map((response) => ({
        studentWorkId: response.studentWorkId,
        workgroupId: response.workgroupId,
        responseTimestamp: response.responseTimestamp,
        text: response.text,
        texts: response.text ? [response.text] : [],
        timestamp: response.responseTimestamp ?? 0,
        usernames: this.getDisplayNames(response.workgroupId),
        avatarColor: getAvatarColorForWorkgroupId(response.workgroupId)
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  private getDisplayNames(workgroupId: number): string {
    const wg = this.workgroups?.find((workgroup) => workgroup.workgroupId === workgroupId);
    return wg?.displayNames ?? $localize`Student ${workgroupId}`;
  }

  protected getDisplayName(response: StudentResponseItem): string {
    if (this.studentNamesDisplayMode === 'anonymize') {
      return $localize`Student ${response.workgroupId}`;
    }
    return response.usernames;
  }

  protected getCardBackgroundColor(index: number): string {
    const color = branchPathBackgroundColors[index % branchPathBackgroundColors.length];
    return `color-mix(in srgb, ${color} 20%, white)`;
  }
}
