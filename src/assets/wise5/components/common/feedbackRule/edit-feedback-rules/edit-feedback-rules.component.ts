import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { generateRandomKey } from '../../../../common/string/string';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { FeedbackRuleHelpComponent } from '../feedback-rule-help/feedback-rule-help.component';
import { FeedbackRule } from '../FeedbackRule';

@Component({
  selector: 'edit-feedback-rules',
  templateUrl: './edit-feedback-rules.component.html',
  styleUrl: './edit-feedback-rules.component.scss',
  imports: [
    MatTooltip,
    MatIcon,
    MatButtonModule,
    DragDropModule,
    CdkScrollable,
    MatCard,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    CdkTextareaAutosize
  ]
})
export class EditFeedbackRulesComponent implements OnInit {
  @Input() feedbackRules: Partial<FeedbackRule>[] = [];
  inputChanged: Subject<string> = new Subject<string>();
  subscriptions: Subscription = new Subscription();
  @Input() version: number = 2;

  constructor(
    protected dialog: MatDialog,
    protected projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.inputChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.projectService.nodeChanged();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>): void {
    this.moveRuleItem(event.previousIndex, event.currentIndex);
  }

  moveUp(ruleIndex: number): void {
    this.moveRuleItem(ruleIndex, ruleIndex - 1);
  }

  moveDown(ruleIndex: number): void {
    this.moveRuleItem(ruleIndex, ruleIndex + 1);
  }

  moveRuleItem(previousIndex: number, currentIndex: number): void {
    moveItemInArray(this.feedbackRules, previousIndex, currentIndex);
    this.projectService.nodeChanged();
  }

  addNewRule(position: number): void {
    const newFeedbackRule = this.createNewFeedbackRule();
    this.feedbackRules.splice(position, 0, newFeedbackRule);
    this.projectService.nodeChanged();
  }

  protected createNewFeedbackRule(): Partial<FeedbackRule> {
    if (this.version === 1) {
      return { expression: '', feedback: '' };
    } else {
      return { id: generateRandomKey(), expression: '', feedback: [''] };
    }
  }

  addNewFeedbackToRule(rule: Partial<FeedbackRule>): void {
    (rule.feedback as string[]).push('');
    this.projectService.nodeChanged();
  }

  deleteFeedbackInRule(rule: FeedbackRule, feedbackIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this feedback?`)) {
      (rule.feedback as string[]).splice(feedbackIndex, 1);
      this.projectService.nodeChanged();
    }
  }

  deleteRule(ruleIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this feedback rule?`)) {
      this.feedbackRules.splice(ruleIndex, 1);
      this.projectService.nodeChanged();
    }
  }

  customTrackBy(index: number): number {
    return index;
  }

  showHelp(): void {
    this.dialog.open(FeedbackRuleHelpComponent);
  }
}
