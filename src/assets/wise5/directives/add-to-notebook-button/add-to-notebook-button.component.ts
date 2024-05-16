import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'add-to-notebook-button',
  standalone: true,
  templateUrl: 'add-to-notebook-button.component.html'
})
export class AddToNotebookButtonComponent {
  @Input() isDisabled: boolean;
  @Output() snipImage = new EventEmitter<void>();
}
