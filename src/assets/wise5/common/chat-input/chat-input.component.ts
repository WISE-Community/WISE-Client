import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
  standalone: true,
  imports: [FormsModule, FlexLayoutModule, MatButtonModule, MatFormFieldModule, MatInputModule]
})
export class ChatInputComponent {
  protected response: string = '';
  @Input() submitDisabled: boolean = false;
  @Output() submitEvent: EventEmitter<string> = new EventEmitter<string>();

  protected keyPressed(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.response.length > 0 && !this.submitDisabled) {
        this.submit();
      }
    }
  }

  protected submit(): void {
    this.submitEvent.emit(this.response);
    this.response = '';
  }
}
