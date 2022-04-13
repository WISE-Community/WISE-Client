import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'edit-dialog-guidance-feedback-rules',
  templateUrl: './edit-dialog-guidance-feedback-rules.component.html',
  styleUrls: ['./edit-dialog-guidance-feedback-rules.component.scss']
})
export class EditDialogGuidanceFeedbackRulesComponent implements OnInit {
  @Input() feedbackRules: any = [];
  inputChanged: Subject<string> = new Subject<string>();
  subscriptions: Subscription = new Subscription();

  constructor(private ProjectService: TeacherProjectService) {}

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
    const newFeedbackRule = { expression: '', feedback: '' };
    if (position === 'beginning') {
      this.feedbackRules.unshift(newFeedbackRule);
    } else {
      this.feedbackRules.push(newFeedbackRule);
    }
    this.ProjectService.nodeChanged();
  }

  deleteRule(ruleIndex: number): void {
    this.feedbackRules.splice(ruleIndex, 1);
    this.ProjectService.nodeChanged();
  }
}
