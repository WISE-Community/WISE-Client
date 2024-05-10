import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';
import { CommonModule } from '@angular/common';
import { DynamicPromptComponent } from '../dynamic-prompt/dynamic-prompt.component';

@Component({
  imports: [CommonModule, DynamicPromptComponent],
  selector: 'prompt',
  standalone: true,
  styleUrl: './prompt.component.scss',
  templateUrl: './prompt.component.html'
})
export class PromptComponent {
  @Input() componentId: string;
  @Input() dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();
  @Input() nodeId: string;
  @Input() prompt: string;

  protected onDynamicPromptChanged(feedbackRule: FeedbackRule): void {
    this.dynamicPromptChanged.emit(feedbackRule);
  }
}
