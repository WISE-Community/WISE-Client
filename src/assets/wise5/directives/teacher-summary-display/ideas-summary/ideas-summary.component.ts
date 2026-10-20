import { Annotation } from '../../../common/Annotation';
import { AnnotationService } from '../../../services/annotationService';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewChild, inject } from '@angular/core';
import { ComponentState } from '../../../../../app/domain/componentState';
import { ConfigService } from '../../../services/configService';
import { CRaterRubric } from '../../../components/common/cRater/CRaterRubric';
import { CRaterService } from '../../../services/cRaterService';
import { DialogGuidanceSummaryData } from '../summary-data/DialogGuidanceSummaryData';
import { FormsModule } from '@angular/forms';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';
import { IdeasSummaryData } from '../summary-data/IdeasSummaryData';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Node } from '../../../common/Node';
import { ComponentContent } from '../../../common/ComponentContent';
import { OpenResponseSummaryData } from '../summary-data/OpenResponseSummaryData';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherPresentationButtonComponent } from '../../../teacher-presentation/teacher-presentation-button/teacher-presentation-button.component';
import { IdeasPresentationResponse } from '../../../teacher-presentation/models/teacher-presentation-config';
import { TeacherPresentationSelectionStore } from '../../../teacher-presentation/state/teacher-presentation-selection.store';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';

export interface StudentResponseItem {
  studentWorkId?: number;
  workgroupId?: number;
  /** Timestamp of the student's chat message (Dialog Guidance); null for single-response work. */
  responseTimestamp?: number | null;
  text: string;
  texts: string[];
  timestamp: number;
  usernames: string;
  avatarColor: string;
}

export interface StudentResponseGroup {
  workgroupId: number;
  usernames: string;
  avatarColor: string;
  responses: StudentResponseItem[];
}

export interface IdeaTableRow {
  id: string;
  text: string;
  count: number;
  sampleResponse: string;
  fullSampleResponse: string;
  isSampleResponseTruncated: boolean;
  responses: StudentResponseItem[];
  studentGroups: StudentResponseGroup[];
}

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    TeacherPresentationButtonComponent
  ],
  providers: [TeacherPresentationSelectionStore],
  selector: 'ideas-summary',
  styleUrls: [
    './ideas-summary.component.scss',
    '../../summary-display/summary-display.component.scss'
  ],
  templateUrl: 'ideas-summary.component.html'
})
export class IdeasSummaryComponent extends TeacherSummaryDisplayComponent {
  @Input() componentType: string;
  @Input() expanded: boolean;

  protected store = inject(TeacherPresentationSelectionStore);
  protected dataSource = new MatTableDataSource<IdeaTableRow>([]);
  protected expandedIdeaIds = new Set<string>();
  protected searchQuery = '';
  protected rubric: CRaterRubric;
  protected workgroups: any[] = [];
  protected readonly UNIQUE_THRESHOLD = 2;
  protected readonly SAMPLE_RESPONSE_MAX_CHARS = 150;

  get isSinglePeriod(): boolean {
    return this.periodId != null && this.periodId !== -1;
  }

  get periodName(): string | undefined {
    if (this.periodId != null) {
      const period = this.configService
        .getPeriods()
        ?.find((p: any) => p.periodId === this.periodId);
      if (period) return period.periodName || period.name;
    }
    return undefined;
  }

  get node(): Node {
    return (this.projectService as TeacherProjectService).getNode(this.nodeId);
  }

  get component(): ComponentContent {
    return (this.projectService as TeacherProjectService).getComponent(
      this.nodeId,
      this.componentId
    );
  }

  get isPresentationAvailable(): boolean {
    return this.isSinglePeriod;
  }

  get displayedColumns(): string[] {
    if (this.isPresentationAvailable) {
      return ['select', 'text', 'sampleResponse', 'count'];
    }
    return ['text', 'sampleResponse', 'count'];
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (sort) {
      this.sort = sort;
      this.dataSource.sort = sort;
    }
  }
  protected sort: MatSort;

  constructor(
    protected annotationService: AnnotationService,
    protected configService: ConfigService,
    protected cRaterService: CRaterService,
    protected dataService: TeacherDataService,
    protected projectService: TeacherProjectService,
    protected summaryService: SummaryService
  ) {
    super(
      annotationService,
      configService,
      cRaterService,
      dataService,
      projectService,
      summaryService
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.initPresentationStore();
    this.generateIdeasSummary();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes.periodId || changes.componentId || changes.nodeId) {
      this.initPresentationStore();
      this.generateIdeasSummary();
    }
  }

  private initPresentationStore(): void {
    const runId = this.configService.getRunId();
    if (runId && this.nodeId && this.componentId) {
      this.store.init(
        runId,
        this.periodId,
        this.nodeId,
        this.componentId,
        this.componentType,
        'Ideas'
      );
    }
  }

  private generateIdeasSummary(): void {
    this.rubric = this.cRaterService.getCRaterRubric(this.nodeId, this.componentId);
    this.workgroups = this.configService.getClassmateUserInfos() ?? [];

    if (this.componentType === 'DialogGuidance') {
      const work$ = this.getLatestWork();
      if (work$) {
        work$.subscribe((componentStates) => {
          const states = componentStates ?? [];
          this.groupIdeas(new DialogGuidanceSummaryData(states, this.rubric), states);
        });
      }
    } else if (this.componentType === 'OpenResponse') {
      const allAnnotations = this.annotationService
        .getAnnotationsByNodeIdComponentId(this.nodeId, this.componentId)
        .filter((annotation) => !this.isSinglePeriod || annotation.periodId === this.periodId);
      const latestAnnotations = allAnnotations.reduceRight(
        (latestAnnotations, annotation) =>
          latestAnnotations.some(
            (latestAnnotation) => latestAnnotation.toWorkgroupId === annotation.toWorkgroupId
          )
            ? latestAnnotations
            : latestAnnotations.concat(annotation),
        []
      );
      const summaryData = new OpenResponseSummaryData(latestAnnotations, this.rubric);
      const work$ = this.getLatestWork();
      if (work$) {
        work$.subscribe((componentStates) => {
          const cachedStates = this.dataService
            ?.getComponentStatesByComponentId?.(this.componentId)
            ?.filter((s: any) => !this.isSinglePeriod || s.periodId === this.periodId);
          const states =
            cachedStates && cachedStates.length > 0 ? cachedStates : (componentStates ?? []);
          this.groupIdeas(summaryData, states, allAnnotations);
        });
      } else {
        const cachedStates = this.dataService
          ?.getComponentStatesByComponentId?.(this.componentId)
          ?.filter((s: any) => !this.isSinglePeriod || s.periodId === this.periodId);
        this.groupIdeas(summaryData, cachedStates ?? [], allAnnotations);
      }
    }
  }

  private groupIdeas(
    ideasSummaryData: IdeasSummaryData,
    componentStates: ComponentState[] = [],
    annotations: Annotation[] = []
  ): void {
    if (ideasSummaryData.hasAnyDetectedIdeas()) {
      this.doRender = true;
      const allIdeas = ideasSummaryData.getAllIdeas();
      const rows: IdeaTableRow[] = allIdeas.map((idea) => {
        let responses: StudentResponseItem[] = [];
        if (this.componentType === 'DialogGuidance') {
          responses = this.getDGResponsesWithIdea(componentStates, idea.id);
        } else if (this.componentType === 'OpenResponse') {
          responses = this.getORResponsesWithIdea(componentStates, annotations, idea.id);
        }
        const fullSample = this.getRandomResponse(responses);
        const { text: sampleResponse, isTruncated: isSampleResponseTruncated } =
          this.truncateToChars(fullSample, this.SAMPLE_RESPONSE_MAX_CHARS);
        return {
          id: idea.id,
          text: idea.text,
          count: idea.count,
          sampleResponse: sampleResponse,
          fullSampleResponse: fullSample,
          isSampleResponseTruncated: isSampleResponseTruncated,
          responses: responses,
          studentGroups: this.groupResponsesByWorkgroup(responses)
        };
      });
      rows.sort((a, b) => b.count - a.count);
      this.dataSource.data = rows;
      this.setupDataSource();
    } else {
      this.doRender = false;
      this.dataSource.data = [];
    }
  }

  private groupResponsesByWorkgroup(responses: StudentResponseItem[]): StudentResponseGroup[] {
    const groups: StudentResponseGroup[] = [];
    responses.forEach((resp) => {
      let group = groups.find(
        (g) =>
          (resp.workgroupId != null && g.workgroupId === resp.workgroupId) ||
          (resp.workgroupId == null && g.usernames === resp.usernames)
      );
      if (!group) {
        group = {
          workgroupId: resp.workgroupId ?? 0,
          usernames: resp.usernames,
          avatarColor: resp.avatarColor,
          responses: []
        };
        groups.push(group);
      }
      group.responses.push(resp);
    });
    return groups;
  }

  protected getRandomResponse(responses: StudentResponseItem[] = []): string {
    const candidates = responses
      .flatMap((r) => (r.texts && r.texts.length > 0 ? r.texts : [r.text]))
      .map((t) => t?.trim())
      .filter((t): t is string => !!t);
    if (candidates.length === 0) {
      return '';
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  protected truncateToChars(
    text: string = '',
    maxChars: number = this.SAMPLE_RESPONSE_MAX_CHARS
  ): { text: string; isTruncated: boolean } {
    const trimmed = text.trim();
    if (trimmed.length <= maxChars) {
      return { text: trimmed, isTruncated: false };
    }
    let cut = trimmed.slice(0, maxChars);
    if (!/\s/.test(trimmed[maxChars]) && !/\s/.test(cut[cut.length - 1])) {
      const lastSpaceIndex = cut.search(/\s\S*$/);
      if (lastSpaceIndex > 0) {
        cut = cut.slice(0, lastSpaceIndex);
      }
    }
    return {
      text: cut.trimEnd() + '...',
      isTruncated: true
    };
  }

  private setupDataSource(): void {
    this.dataSource.filterPredicate = (row: IdeaTableRow, filter: string): boolean => {
      const q = filter.trim().toLowerCase();
      if (!q) {
        return true;
      }
      return (
        row.text.toLowerCase().includes(q) ||
        row.responses.some(
          (r) =>
            r.texts?.some((t) => t.toLowerCase().includes(q)) || r.text?.toLowerCase().includes(q)
        )
      );
    };

    this.dataSource.sortingDataAccessor = (row: IdeaTableRow, sortHeaderId: string) => {
      if (sortHeaderId === 'count') {
        return row.count;
      } else if (sortHeaderId === 'text') {
        return row.text.toLowerCase();
      }
      return '';
    };

    this.dataSource.sortData = (data: IdeaTableRow[], sort: MatSort): IdeaTableRow[] => {
      const active = sort.active;
      const direction = sort.direction;
      if (!active || direction === '') {
        return data;
      }

      return data.sort((a, b) => {
        if (active === 'count') {
          if (a.count === 0 && b.count > 0) {
            return 1;
          }
          if (b.count === 0 && a.count > 0) {
            return -1;
          }
          return (a.count - b.count) * (direction === 'asc' ? 1 : -1);
        }

        const valueA = this.dataSource.sortingDataAccessor(a, active);
        const valueB = this.dataSource.sortingDataAccessor(b, active);
        let comparatorResult = 0;
        if (valueA != null && valueB != null) {
          if (valueA > valueB) {
            comparatorResult = 1;
          } else if (valueA < valueB) {
            comparatorResult = -1;
          }
        } else if (valueA != null) {
          comparatorResult = 1;
        } else if (valueB != null) {
          comparatorResult = -1;
        }
        return comparatorResult * (direction === 'asc' ? 1 : -1);
      });
    };

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Dialog Guidance work is additive: each saved state contains the whole chat history. Return one
   * item per student message that expressed the idea, identified by workgroup and message
   * timestamp, so a message is listed once no matter how many saved states contain it.
   */
  private getDGResponsesWithIdea(states: ComponentState[], ideaId: string): StudentResponseItem[] {
    const responsesByKey = new Map<string, StudentResponseItem>();
    states.forEach((state) => {
      state.studentData?.responses?.forEach((response, index, responses) => {
        if (response?.ideas?.some((idea) => idea.detected && idea.name === ideaId)) {
          const studentResponse = responses[index - 1];
          if (studentResponse?.text != null) {
            const timestamp = studentResponse.timestamp ?? state.clientSaveTime;
            const item: StudentResponseItem = {
              studentWorkId: state.id!,
              workgroupId: state.workgroupId,
              responseTimestamp: studentResponse.timestamp ?? null,
              text: studentResponse.text,
              texts: [studentResponse.text],
              timestamp: timestamp,
              usernames: this.getDisplayNames(state.workgroupId),
              avatarColor: getAvatarColorForWorkgroupId(state.workgroupId)
            };
            const key = `${state.workgroupId}:${timestamp}:${studentResponse.text}`;
            const existing = responsesByKey.get(key);
            if (!existing || (state.id ?? 0) >= (existing.studentWorkId ?? 0)) {
              responsesByKey.set(key, item);
            }
          }
        }
      });
    });
    return Array.from(responsesByKey.values()).sort((a, b) => a.timestamp - b.timestamp);
  }

  private getORResponsesWithIdea(
    states: ComponentState[],
    annotations: Annotation[],
    ideaId: string
  ): StudentResponseItem[] {
    const matchingAnnotations = annotations.filter((annotation) =>
      annotation.data?.ideas?.some((idea) => idea.detected && idea.name === ideaId)
    );
    return states
      .filter((state) =>
        matchingAnnotations.some((annotation) =>
          annotation.studentWorkId != null
            ? annotation.studentWorkId === state.id
            : annotation.toWorkgroupId === state.workgroupId
        )
      )
      .map((state) => {
        const text = state.studentData?.response ?? '';
        return {
          studentWorkId: state.id!,
          workgroupId: state.workgroupId,
          text: text,
          texts: text ? [text] : [],
          timestamp: state.clientSaveTime,
          usernames: this.getDisplayNames(state.workgroupId),
          avatarColor: getAvatarColorForWorkgroupId(state.workgroupId)
        };
      });
  }

  private getDisplayNames(workgroupId: number): string {
    const wg = this.workgroups?.find((workgroup) => workgroup.workgroupId === workgroupId);
    return wg?.displayNames ?? $localize`Student ${workgroupId}`;
  }

  protected isUnique(row: IdeaTableRow): boolean {
    return row.count > 0 && row.count <= this.UNIQUE_THRESHOLD;
  }

  protected toggleRow(row: IdeaTableRow): void {
    if (row.count === 0) {
      return;
    }
    if (this.expandedIdeaIds.has(row.id)) {
      this.expandedIdeaIds.delete(row.id);
    } else {
      this.expandedIdeaIds.add(row.id);
    }
  }

  protected onRowKeydown(event: KeyboardEvent, row: IdeaTableRow): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleRow(row);
    }
  }

  protected isExpanded(row: IdeaTableRow): boolean {
    return row.count > 0 && this.expandedIdeaIds.has(row.id);
  }

  protected applyFilter(): void {
    this.dataSource.filter = this.searchQuery.trim().toLowerCase();
  }

  protected toSelection(response: StudentResponseItem): IdeasPresentationResponse {
    return {
      studentWorkId: response.studentWorkId,
      workgroupId: response.workgroupId,
      responseTimestamp: response.responseTimestamp ?? null,
      text: response.text
    };
  }

  protected isResponseSelected(row: IdeaTableRow, response: StudentResponseItem): boolean {
    return this.store.isIdeaResponseSelected(row.id, this.toSelection(response));
  }

  protected toggleResponse(row: IdeaTableRow, response: StudentResponseItem): void {
    this.store.toggleIdeaResponse(row.id, this.toSelection(response));
  }

  protected toggleIdea(row: IdeaTableRow): void {
    this.store.toggleIdea(
      row.id,
      row.responses?.map((response) => this.toSelection(response))
    );
  }

  protected override renderDisplay(): void {
    this.generateIdeasSummary();
  }
}
