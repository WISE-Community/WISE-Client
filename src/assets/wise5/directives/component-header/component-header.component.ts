import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';

@Component({
  selector: 'component-header',
  styleUrls: ['component-header.component.scss'],
  templateUrl: 'component-header.component.html'
})
export class ComponentHeader {
  @Input() componentContent: any;
  dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();
  @Input() nodeId: string;
  prompt: SafeHtml;

  constructor(protected sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.prompt = this.sanitizer.bypassSecurityTrustHtml(this.componentContent.prompt);
    this.dynamicPrompt = new DynamicPrompt(this.componentContent.dynamicPrompt);
  }

  onDynamicPromptChanged(feedbackRule: FeedbackRule): void {
    this.dynamicPromptChanged.emit(feedbackRule);
  }
}
