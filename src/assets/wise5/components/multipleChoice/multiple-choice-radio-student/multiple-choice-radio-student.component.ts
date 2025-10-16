import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  imports: [CommonModule, FormsModule, MatRadioModule],
  selector: 'multiple-choice-radio-student',
  templateUrl: './multiple-choice-radio-student.component.html'
})
export class MultipleChoiceRadioStudentComponent {
  @Input() choices: any[];
  @Input() studentChoices: string;
  @Input() isDisabled: boolean;
  @Input() showFeedback: boolean;
  @Input() componentHasCorrectAnswer: boolean;
  @Output() studentChoicesChange = new EventEmitter<string>();
}
