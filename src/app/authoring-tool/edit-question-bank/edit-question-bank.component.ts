import { Component, Input, OnInit } from '@angular/core';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { QuestionBank } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/QuestionBank';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { NgIf } from '@angular/common';
import { TranslatableInputComponent } from '../../../assets/wise5/authoringTool/components/translatable-input/translatable-input.component';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SelectStepAndComponentComponent } from '../select-step-and-component/select-step-and-component.component';
import { EditComponentPeerGroupingTagComponent } from '../edit-component-peer-grouping-tag/edit-component-peer-grouping-tag.component';
import { EditQuestionBankRulesComponent } from '../edit-question-bank-rules/edit-question-bank-rules.component';

@Component({
  selector: 'edit-question-bank',
  templateUrl: './edit-question-bank.component.html',
  styleUrl: './edit-question-bank.component.scss',
  imports: [
    MatCheckbox,
    NgIf,
    TranslatableInputComponent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    SelectStepAndComponentComponent,
    EditComponentPeerGroupingTagComponent,
    EditQuestionBankRulesComponent
  ]
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
