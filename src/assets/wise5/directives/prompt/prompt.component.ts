import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';

@Component({
  selector: 'prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {
  @Input() componentId: string;
  @Input() dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();
  @Input() nodeId: string;
  @Input() prompt: string;

  constructor() {}

  ngOnInit(): void {}

  onDynamicPromptChanged(feedbackRule: FeedbackRule): void {
    this.dynamicPromptChanged.emit(feedbackRule);
  }
}
