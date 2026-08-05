import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component as WISEComponent } from '../../common/Component';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';
import { PossibleScoreComponent } from '../../../../app/possible-score/possible-score.component';
import { PromptComponent } from '../prompt/prompt.component';

@Component({
  imports: [PossibleScoreComponent, PromptComponent],
  selector: 'component-header',
  styles: ['.component-header { padding-bottom: 8px; } .prompt { font-weight: 500; } .activity-title:not(:empty) { font-size: 24px; line-height: 32px; font-weight: 700; margin-bottom: 8px; }'],
  templateUrl: 'component-header.component.html'
})
export class ComponentHeaderComponent {
  @Input() component: WISEComponent;
  protected dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();

  constructor(protected sanitizer: DomSanitizer) {}

  protected get title(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.component.content.title || '');
  }

  protected get prompt(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.component.content.prompt || '');
  }

  ngOnInit(): void {
    this.dynamicPrompt = new DynamicPrompt(this.component.content.dynamicPrompt);
  }

  protected onDynamicPromptChanged(feedbackRule: FeedbackRule): void {
    this.dynamicPromptChanged.emit(feedbackRule);
  }
}
