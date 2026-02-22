import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'insert-node-inside-button',
  templateUrl: './insert-node-inside-button.component.html'
})
export class InsertNodeInsideButtonComponent {
  @Output() insertEvent = new EventEmitter();
}
