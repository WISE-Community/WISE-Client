import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component as WISEComponent } from '../../common/Component';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';
import { PossibleScoreComponent } from '../../../../app/possible-score/possible-score.component';
import { PromptComponent } from '../prompt/prompt.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [FlexLayoutModule, PossibleScoreComponent, PromptComponent],
  selector: 'component-header',
  standalone: true,
  styleUrl: 'component-header.component.scss',
  templateUrl: 'component-header.component.html'
})
export class ComponentHeaderComponent {
  @Input() component: WISEComponent;
  protected dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();
  protected prompt: SafeHtml;

  constructor(protected sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.prompt = this.sanitizer.bypassSecurityTrustHtml(this.component.content.prompt);
    this.dynamicPrompt = new DynamicPrompt(this.component.content.dynamicPrompt);
  }

  protected onDynamicPromptChanged(feedbackRule: FeedbackRule): void {
    this.dynamicPromptChanged.emit(feedbackRule);
  }
}
