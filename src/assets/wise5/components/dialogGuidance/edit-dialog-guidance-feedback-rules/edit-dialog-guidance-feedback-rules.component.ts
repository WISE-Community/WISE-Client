import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { FeedbackRule } from '../FeedbackRule';
import { MatDialog } from '@angular/material/dialog';
import { DialogGuidanceFeedbackRuleHelpComponent } from '../dialog-guidance-feedback-rule-help/dialog-guidance-feedback-rule-help.component';

@Component({
  selector: 'edit-dialog-guidance-feedback-rules',
  templateUrl: './edit-dialog-guidance-feedback-rules.component.html',
  styleUrls: ['./edit-dialog-guidance-feedback-rules.component.scss']
})
export class EditDialogGuidanceFeedbackRulesComponent implements OnInit {
  @Input() feedbackRules: FeedbackRule[] = [];
  inputChanged: Subject<string> = new Subject<string>();
  subscriptions: Subscription = new Subscription();
  @Input() version: number = 2;

  constructor(
    private dialog: MatDialog,
    private projectService: TeacherProjectService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.inputChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.projectService.nodeChanged();
      })
    );
  }

  ngOnDestroy() {
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

  addNewRule(position: string): void {
    const newFeedbackRule = this.createNewFeedbackRule();
    if (position === 'beginning') {
      this.feedbackRules.unshift(newFeedbackRule);
    } else {
      this.feedbackRules.push(newFeedbackRule);
    }
    this.projectService.nodeChanged();
  }

  private createNewFeedbackRule(): any {
    if (this.version === 1) {
      return { expression: '', feedback: '' };
    } else {
      return { id: this.utilService.generateKey(10), expression: '', feedback: [''] };
    }
  }

  addNewFeedbackToRule(rule: FeedbackRule): void {
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
    this.dialog.open(DialogGuidanceFeedbackRuleHelpComponent);
  }
}
