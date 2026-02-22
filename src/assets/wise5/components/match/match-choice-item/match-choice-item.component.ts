import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { DeleteChoiceButtonComponent } from '../delete-choice-button/delete-choice-button.component';
import { MatchStatusIconComponent } from '../match-status-icon/match-status-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    DeleteChoiceButtonComponent,
    MatCardModule,
    MatchStatusIconComponent,
    MatIconModule
  ],
  selector: 'match-choice-item',
  styleUrl: 'match-choice-item.component.scss',
  templateUrl: 'match-choice-item.component.html'
})
export class MatchChoiceItemComponent {
  @Input() buckets: any;
  @Input() hasCorrectAnswer: boolean;
  @Input() isDisabled: boolean;
  @Input() item: any;
  @Output() onStudentDataChanged = new EventEmitter();
}
