import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';
import { DynamicPromptComponent } from '../dynamic-prompt/dynamic-prompt.component';

@Component({
  imports: [DynamicPromptComponent],
  selector: 'prompt',
  styles: ['.prompt { font-weight: 500; }'],
  template: `
    @if (!dynamicPrompt?.enabled) {
      <div [innerHTML]="prompt" class="prompt"></div>
    } @else {
      <dynamic-prompt
        [nodeId]="nodeId"
        [componentId]="componentId"
        [dynamicPrompt]="dynamicPrompt"
        (dynamicPromptChanged)="onDynamicPromptChanged($event)"
      />
    }
  `
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
