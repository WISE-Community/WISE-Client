import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  imports: [CommonModule, FormsModule, MatCheckboxModule],
  selector: 'multiple-choice-checkbox-student',
  templateUrl: './multiple-choice-checkbox-student.component.html'
})
export class MultipleChoiceCheckboxStudentComponent {
  @Input() choices: any[];
  @Input() studentChoices: string[];
  @Input() isDisabled: boolean;
  @Input() showFeedback: boolean;
  @Input() componentHasCorrectAnswer: boolean;
  @Output() updateStudentChoices = new EventEmitter<string>();
}
