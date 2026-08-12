import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Component as WISEComponent } from '../../common/Component';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';
import { PossibleScoreComponent } from '../../../../app/possible-score/possible-score.component';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  imports: [PossibleScoreComponent, PromptComponent],
  selector: 'component-header',
  templateUrl: 'component-header.component.html'
})
export class ComponentHeaderComponent {
  @Input() component: WISEComponent;
  protected dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();

  constructor() {}

  protected get title(): string {
    return this.component.content.title || '';
  }

  protected get prompt(): string {
    return this.component.content.prompt || '';
  }

  ngOnInit(): void {
    this.dynamicPrompt = new DynamicPrompt(this.component.content.dynamicPrompt);
  }

  protected onDynamicPromptChanged(feedbackRule: FeedbackRule): void {
    this.dynamicPromptChanged.emit(feedbackRule);
  }
}
