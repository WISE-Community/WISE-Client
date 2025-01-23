import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatchStatusIconComponent } from '../match-status-icon/match-status-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [FlexLayoutModule, MatchStatusIconComponent, MatIconModule, MatCardModule, NgClass],
  selector: 'match-choice-item',
  standalone: true,
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
