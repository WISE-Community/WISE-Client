import { Component, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { QuestionBank } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/QuestionBank';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'edit-question-bank',
  templateUrl: './edit-question-bank.component.html',
  styleUrls: ['./edit-question-bank.component.scss']
})
export class EditQuestionBankComponent implements OnInit {
  protected allowedReferenceComponentTypes: string[] = ['MultipleChoice', 'OpenResponse'];
  @Input() componentContent: any;
  protected inputChanged: Subject<string> = new Subject<string>();
  private subscriptions: Subscription = new Subscription();

  constructor(private projectService: TeacherProjectService) {}

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

  toggleComponent(event: MatCheckboxChange): void {
    if (this.componentContent.questionBank == null) {
      this.componentContent.questionBank = new QuestionBank({
        referenceComponent: {},
        rules: [],
        version: 2
      });
    }
    this.componentContent.questionBank.enabled = event.checked;
    this.saveChanges();
  }

  saveChanges(): void {
    this.projectService.nodeChanged();
  }
}
