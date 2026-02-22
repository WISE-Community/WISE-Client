import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'insert-node-after-button',
  templateUrl: './insert-node-after-button.component.html'
})
export class InsertNodeAfterButtonComponent {
  @Input() disabled: boolean;
  @Output() insertEvent = new EventEmitter();
}
