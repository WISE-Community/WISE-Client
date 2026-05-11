import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule, MatTooltipModule],
  selector: 'add-mc-choice',
  styleUrl: 'add-mc-choice.component.scss',
  templateUrl: 'add-mc-choice.component.html'
})
export class AddMCChoiceComponent {
  protected focus: boolean;
  @Output() newChoiceEvent: EventEmitter<void> = new EventEmitter<void>();
}
