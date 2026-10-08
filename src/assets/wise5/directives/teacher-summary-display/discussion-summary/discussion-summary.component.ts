import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Component as WISEComponent } from '../../../common/Component';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { DiscussionTeacherComponent } from '../../../components/discussion/discussion-teacher/discussion-teacher.component';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TEACHER_SUMMARY_CONFIG } from '../TeacherSummaryConfig';
import { TeacherPresentationSelectionStore } from '../../../teacher-presentation/teacher-presentation-selection.store';
import { TeacherPresentationButtonComponent } from '../../../teacher-presentation/teacher-presentation-button.component';
import { TeacherPresentationReflectionQuestion } from '../../../teacher-presentation/teacher-presentation-config';
import { Node } from '../../../common/Node';

@Component({
  imports: [
    DiscussionTeacherComponent,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    TeacherPresentationButtonComponent
  ],
  providers: [TeacherPresentationSelectionStore],
  selector: 'discussion-summary',
  styleUrl: '../../summary-display/summary-display.component.scss',
  template: `
    <div [class.expanded]="expanded">
      <div class="flex flex-wrap justify-between items-center mb-2 gap-2">
        <h2 class="mat-subtitle-1 m-0" i18n>Class Discussion</h2>
        <teacher-presentation-button
          [node]="node"
          [component]="component"
          [periodId]="periodId"
          [periodName]="periodName"
          [store]="store"
        />
      </div>

      <div class="mb-4 flex flex-wrap gap-4 justify-between items-center">
        @if (component?.content?.anonymizeResponses) {
          <span class="mat-caption" i18n
            >Note: Students do not see each other's names in this activity.</span
          >
        }
      </div>

      @if (hasReflectionQuestions && isSinglePeriod) {
        <mat-expansion-panel class="mb-4">
          <mat-expansion-panel-header>
            <mat-panel-title i18n>Teacher Reflection</mat-panel-title>
            <mat-panel-description i18n>Reflect on selected student work</mat-panel-description>
          </mat-expansion-panel-header>
          <div class="flex flex-col gap-4 py-2">
            @for (q of reflectionQuestions; track q.id) {
              <div class="flex flex-col gap-1">
                <label class="font-medium text-sm">{{ q.text }}</label>
                <mat-form-field appearance="outline" class="w-full">
                  <textarea
                    matInput
                    rows="2"
                    [ngModel]="getAnswerText(q.id)"
                    (ngModelChange)="onAnswerChange(q, $event)"
                    placeholder="Enter your reflection..."
                    i18n-placeholder
                  ></textarea>
                </mat-form-field>
              </div>
            }
          </div>
        </mat-expansion-panel>
      }

      <discussion-teacher
        class="max-h-160 block overflow-y-auto"
        [class.max-h-none]="expanded"
        [nodeId]="nodeId"
        [component]="component"
        [periodId]="periodId"
        [anonymizeResponses]="teacherSummaryConfig.anonymizeStudentNames"
        [selectable]="isSinglePeriod"
        [presentationStore]="store"
        [mode]="'summary'"
      />
    </div>
  `
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

  get reflectionQuestions(): TeacherPresentationReflectionQuestion[] {
    return this.component?.content?.presentation?.reflectionQuestions || [];
  }

  get hasReflectionQuestions(): boolean {
    return this.reflectionQuestions.length > 0;
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

  getAnswerText(questionId: string): string {
    return this.store.reflectionAnswers().get(questionId)?.answerText || '';
  }

  onAnswerChange(q: TeacherPresentationReflectionQuestion, text: string): void {
    this.store.saveReflectionAnswer(q.id, q.text, text);
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
        'Discussion',
        this.reflectionQuestions
      );
    }
  }
}
