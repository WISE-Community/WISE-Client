import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component as WISEComponent } from '../../common/Component';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';

@Component({
  selector: 'component-header',
  styleUrls: ['component-header.component.scss'],
  templateUrl: 'component-header.component.html'
})
export class ComponentHeader {
  @Input() component: WISEComponent;
  dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();
  prompt: SafeHtml;

  constructor(protected sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.prompt = this.sanitizer.bypassSecurityTrustHtml(this.component.content.prompt);
    this.dynamicPrompt = new DynamicPrompt(this.component.content.dynamicPrompt);
  }

  onDynamicPromptChanged(feedbackRule: FeedbackRule): void {
    this.dynamicPromptChanged.emit(feedbackRule);
  }
}
