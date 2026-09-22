import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss'],
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule]
})
export class ChatInputComponent {
  @Output() focusEvent = new EventEmitter<string>();
  protected response: string = '';
  @Input() submitDisabled: boolean = false;
  @Output() submitEvent: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('responseTextarea') textareaRef!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.textareaRef.nativeElement.focus();
  }

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
