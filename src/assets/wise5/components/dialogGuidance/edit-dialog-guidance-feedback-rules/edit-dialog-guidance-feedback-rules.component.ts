import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';

@Component({
  selector: 'edit-dialog-guidance-feedback-rules',
  templateUrl: './edit-dialog-guidance-feedback-rules.component.html',
  styleUrls: ['./edit-dialog-guidance-feedback-rules.component.scss']
})
export class EditDialogGuidanceFeedbackRulesComponent implements OnInit {
  @Input() feedbackRules: any = [];
  inputChanged: Subject<string> = new Subject<string>();
  subscriptions: Subscription = new Subscription();
  @Input() version: number;

  constructor(private ProjectService: TeacherProjectService, private utilService: UtilService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.inputChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe(() => {
        this.ProjectService.nodeChanged();
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
    this.ProjectService.nodeChanged();
  }

  addNewRule(position: string): void {
    const newFeedbackRule = this.createNewFeedbackRule();
    if (position === 'beginning') {
      this.feedbackRules.unshift(newFeedbackRule);
    } else {
      this.feedbackRules.push(newFeedbackRule);
    }
    this.ProjectService.nodeChanged();
  }

  createNewFeedbackRule(): any {
    if (this.version === 1) {
      return { expression: '', feedback: '' };
    } else {
      return { id: this.utilService.generateKey(10), expression: '', feedback: [''] };
    }
  }

  addNewFeedbackToRule(rule: any): void {
    rule.feedback.push('');
  }

  deleteFeedbackInRule(rule: any, feedbackIndex: number): void {
    if (confirm($localize`Are you sure you want to delete this feedback string?`)) {
      rule.feedback.splice(feedbackIndex, 1);
    }
  }

  deleteRule(ruleIndex: number): void {
    if (confirm($localize`Are you sure you want to delete thise feedback rule?`)) {
      this.feedbackRules.splice(ruleIndex, 1);
      this.ProjectService.nodeChanged();
    }
  }

  customTrackBy(index: number): number {
    return index;
  }
}
