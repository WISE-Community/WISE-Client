import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslatableInputComponent } from '../../../assets/wise5/authoringTool/components/translatable-input/translatable-input.component';
import { QuestionBank } from '../../../assets/wise5/components/peerChat/peer-chat-question-bank/QuestionBank';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { EditComponentPeerGroupingTagComponent } from '../edit-component-peer-grouping-tag/edit-component-peer-grouping-tag.component';
import { EditQuestionBankRulesComponent } from '../edit-question-bank-rules/edit-question-bank-rules.component';
import { SelectStepAndComponentComponent } from '../select-step-and-component/select-step-and-component.component';

@Component({
  imports: [
    MatCheckbox,
    TranslatableInputComponent,
    FormsModule,
    MatFormFieldModule,
    MatInput,
    SelectStepAndComponentComponent,
    EditComponentPeerGroupingTagComponent,
    EditQuestionBankRulesComponent
  ],
  selector: 'edit-question-bank',
  styleUrl: './edit-question-bank.component.scss',
  templateUrl: './edit-question-bank.component.html'
})
export class EditQuestionBankComponent implements OnInit {
  private projectService = inject(TeacherProjectService);

  protected allowedReferenceComponentTypes: string[] = ['MultipleChoice', 'OpenResponse'];
  @Input() componentContent: any;
  protected inputChanged: Subject<string> = new Subject<string>();
  private subscriptions: Subscription = new Subscription();

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
