import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'select-path-count',
  standalone: true,
  templateUrl: './select-path-count.component.html'
})
export class SelectPathCountComponent {
  @Input() pathCount: number;
  @Output() pathCountChangedEvent: EventEmitter<number> = new EventEmitter<number>();
}
