import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Component as WISEComponent } from '../../../common/Component';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { DiscussionTeacherComponent } from '../../../components/discussion/discussion-teacher/discussion-teacher.component';
import { TEACHER_SUMMARY_CONFIG } from '../TeacherSummaryConfig';
import { TeacherPresentationSelectionStore } from '../../../teacher-presentation/teacher-presentation-selection.store';
import { TeacherPresentationButtonComponent } from '../../../teacher-presentation/teacher-presentation-button.component';
import { Node } from '../../../common/Node';

@Component({
  imports: [
    DiscussionTeacherComponent,
    TeacherPresentationButtonComponent
  ],
  providers: [TeacherPresentationSelectionStore],
  selector: 'discussion-summary',
  styleUrl: '../../summary-display/summary-display.component.scss',
  templateUrl: './discussion-summary.component.html'
})
export class DiscussionSummaryComponent
  extends TeacherSummaryDisplayComponent
  implements OnInit, OnChanges
{
  protected component: WISEComponent;
  @Input() expanded: boolean;

  protected teacherSummaryConfig = inject(TEACHER_SUMMARY_CONFIG);
  protected store = inject(TeacherPresentationSelectionStore);

  get node(): Node {
    return this.projectService.getNode(this.nodeId);
  }

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

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadComponentContent();
    this.initPresentationStore();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes.periodId || changes.componentId || changes.nodeId) {
      this.loadComponentContent();
      this.initPresentationStore();
    }
  }

  private loadComponentContent(): void {
    if (this.nodeId && this.componentId) {
      let content = this.projectService.getComponent(this.nodeId, this.componentId);
      if (content) {
        content = this.projectService.injectAssetPaths(content);
        this.component = new ComponentFactory().getComponent(content, this.nodeId);
      }
    }
  }

  private initPresentationStore(): void {
    const runId = this.configService.getRunId();
    if (runId && this.periodId != null && this.periodId !== -1 && this.nodeId && this.componentId) {
      this.store.init(
        runId,
        this.periodId,
        this.nodeId,
        this.componentId,
        'Discussion'
      );
    }
  }
}
