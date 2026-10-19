import {
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { applyMasonry } from '../../../common/dom/dom';
import { TeacherSummaryDisplayComponent } from '../../../directives/teacher-summary-display/teacher-summary-display.component';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { isMatchingPeriods } from '../../../common/period/period';
import { AnnotationService } from '../../../services/annotationService';
import { Node } from '../../../common/Node';
import { MilestoneReportButtonComponent } from '../milestone-report-button/milestone-report-button.component';
import { PeerGroupButtonComponent } from '../peer-group-button/peer-group-button.component';
import { ComponentCompletionComponent } from '../component-completion/component-completion.component';
import { ComponentContent } from '../../../common/ComponentContent';
import { IdeasSummaryComponent } from '../../../directives/teacher-summary-display/ideas-summary/ideas-summary.component';
import { MatchSummaryDisplayComponent } from '../../../directives/teacher-summary-display/match-summary-display/match-summary-display.component';
import { MatCardModule } from '@angular/material/card';
import { CRaterService } from '../../../services/cRaterService';
import { OpenResponseAiSummaryComponent } from '../../../directives/teacher-summary-display/open-response-ai-summary/open-response-ai-summary.component';
import { ProjectService } from '../../../services/projectService';
import { DiscussionAiSummaryComponent } from '../../../directives/teacher-summary-display/discussion-ai-summary/discussion-ai-summary.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import { DiscussionSummaryComponent } from '../../../directives/teacher-summary-display/discussion-summary/discussion-summary.component';
import { TeacherReflectionComponent } from '../../../teacher-reflection/teacher-reflection.component';

@Component({
  imports: [
    ComponentCompletionComponent,
    DiscussionAiSummaryComponent,
    DiscussionSummaryComponent,
    IdeasSummaryComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatchSummaryDisplayComponent,
    MilestoneReportButtonComponent,
    OpenResponseAiSummaryComponent,
    NgTemplateOutlet,
    PeerGroupButtonComponent,
    TeacherReflectionComponent,
    TeacherSummaryDisplayComponent
  ],
  selector: 'component-summary',
  styleUrl: './component-summary.component.scss',
  templateUrl: './component-summary.component.html'
})
export class ComponentSummaryComponent implements OnDestroy {
  protected aiEnabled: boolean;
  protected avgScore: number;
  @Input() component: ComponentContent;
  protected hasCorrectAnswer: boolean;
  protected hasIdeaRubricData: boolean;
  protected hasStudentWork: boolean;
  private masonryMutationObserver: MutationObserver;
  private masonryResizeObserver: ResizeObserver;
  @Input() node: Node;
  @Input() periodId: number;
  protected showScoreSummary: boolean;
  protected showSummary: boolean;
  protected source: 'allPeriods' | 'period';
  private summariesGridRef: ElementRef<HTMLElement>;
  private COMPONENTS_WITH_SUMMARY = ['Discussion', 'Match', 'MultipleChoice', 'OpenResponse'];

  @ViewChild('summariesGrid') set summariesGrid(el: ElementRef<HTMLElement>) {
    this.summariesGridRef = el;
    this.setupMasonryObserver();
  }

  constructor(
    private annotationService: AnnotationService,
    private componentServiceLookupService: ComponentServiceLookupService,
    private cRaterService: CRaterService,
    private dataService: TeacherDataService,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private projectService: ProjectService,
    private summaryService: SummaryService
  ) {}

  ngOnChanges(): void {
    if (this.node && this.component) {
      this.dataService.retrieveStudentDataForNode(this.node).subscribe(() => this.setComponent());
      this.setSource();
      const annotations = this.getLatestScoreAnnotations();
      const totalScore = annotations.reduce((sumSoFar, a) => sumSoFar + a.data.value, 0);
      this.avgScore = totalScore / annotations.length;
    }
  }

  ngOnDestroy(): void {
    this.disconnectMasonryObservers();
  }

  private setupMasonryObserver(): void {
    this.disconnectMasonryObservers();
    const grid = this.summariesGridRef?.nativeElement;
    if (grid && !CSS.supports('display', 'grid-lanes')) {
      this.masonryResizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => applyMasonry(grid));
      });
      this.observeMasonryElements(grid);
      this.masonryMutationObserver = new MutationObserver(() => {
        this.observeMasonryElements(grid);
        this.ngZone.run(() => applyMasonry(grid));
      });
      this.masonryMutationObserver.observe(grid, { childList: true });
    }
  }

  private observeMasonryElements(grid: HTMLElement): void {
    this.masonryResizeObserver.disconnect();
    this.masonryResizeObserver.observe(grid);
    Array.from(grid.children).forEach((child) => this.masonryResizeObserver.observe(child));
  }

  private disconnectMasonryObservers(): void {
    this.masonryResizeObserver?.disconnect();
    this.masonryMutationObserver?.disconnect();
  }

  private setComponent(): void {
    this.hasCorrectAnswer = this.componentHasCorrectAnswer(this.component);
    this.showScoreSummary =
      this.summaryService.isScoresSummaryAvailableForComponentType(this.component.type) &&
      this.componentHasScoreAnnotation(this.component.id, this.periodId);
    this.hasStudentWork =
      this.dataService
        .getComponentStatesByComponentId(this.component.id)
        .filter((state) => state.periodId === this.periodId).length > 0;
    this.hasIdeaRubricData = this.cRaterService
      .getCRaterRubric(this.node.id, this.component.id)
      .hasRubricData();
    this.aiEnabled = this.projectService.getProject().ai?.enabled;
    this.showSummary =
      this.hasStudentWork &&
      (this.COMPONENTS_WITH_SUMMARY.includes(this.component.type) ||
        this.showScoreSummary ||
        this.hasIdeaRubricData ||
        (this.hasReflectionQuestions && this.isSinglePeriod));
  }

  private setSource(): void {
    this.source = this.periodId === -1 ? 'allPeriods' : 'period';
  }

  private componentHasCorrectAnswer(component: any): boolean {
    return this.componentServiceLookupService
      .getService(component.type)
      .componentHasCorrectAnswer(component);
  }

  private componentHasScoreAnnotation(componentId: string, periodId: number): boolean {
    return this.annotationService
      .getAnnotationsByNodeIdComponentId(this.dataService.getCurrentNode().id, componentId)
      .some(
        (annotation) =>
          isMatchingPeriods(annotation.periodId, periodId) &&
          ['score', 'autoScore'].includes(annotation.type)
      );
  }

  private getLatestScoreAnnotations() {
    return this.annotationService
      .getAnnotationsByNodeIdComponentId(this.node.id, this.component.id)
      .filter((annotation) => this.periodId === -1 || annotation.periodId === this.periodId)
      .filter((annotation) => ['score', 'autoScore'].includes(annotation.type))
      .reduceRight((soFar, currentA) => {
        if (!soFar.some((soFarA) => soFarA.toWorkgroupId === currentA.toWorkgroupId)) {
          soFar.push(currentA);
        }
        return soFar;
      }, []);
  }

  protected expandSummary(type: 'ideas' | 'match' | 'discussion'): void {
    this.dialog.open(SummaryDialogComponent, {
      data: {
        type: type,
        node: this.node,
        component: this.component,
        periodId: this.periodId,
        source: this.source,
        componentType: this.component.type
      },
      panelClass: 'summary-dialog'
    });
  }

  protected get hasReflectionQuestions(): boolean {
    return (this.component.teacher?.reflectionQuestions?.length ?? 0) > 0;
  }

  protected get isSinglePeriod(): boolean {
    return this.periodId != null && this.periodId !== -1;
  }
}

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    DiscussionSummaryComponent,
    IdeasSummaryComponent,
    MatchSummaryDisplayComponent,
    MatButtonModule,
    MatDialogContent,
    MatIconModule
  ],
  styles: `
    @reference "tailwindcss";

    .summary-dialog {
      @apply w-full h-full !max-w-[120rem];
    }
  `,
  templateUrl: './summary-dialog.component.html'
})
class SummaryDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SummaryDialogComponent>
  ) {}
}
