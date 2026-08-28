import { Component, EventEmitter, Input, inject, Output } from '@angular/core';
import { Component as WISEComponent } from '../../common/Component';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { DynamicPrompt } from '../dynamic-prompt/DynamicPrompt';
import { MatIconModule } from '@angular/material/icon';
import { PossibleScoreComponent } from '../../../../app/possible-score/possible-score.component';
import { PromptComponent } from '../prompt/prompt.component';
import { ComponentInfoService } from '../../services/componentInfoService';

@Component({
  imports: [MatIconModule, PossibleScoreComponent, PromptComponent],
  selector: 'component-header',
  templateUrl: 'component-header.component.html'
})
export class ComponentHeaderComponent {
  @Input() component: WISEComponent;
  private componentInfoService = inject(ComponentInfoService);
  protected dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();
  protected hasPrompt: boolean;
  @Input() showPrompt: boolean = true;

  protected get icon(): string {
    return this.componentInfoService.getInfo(this.component.content.type).getIcon();
  }

  protected get title(): string {
    return this.component.content.componentTitle || '';
  }

  protected get prompt(): string {
    return this.component.content.prompt || '';
  }

  ngOnInit(): void {
    this.hasPrompt = this.prompt && this.showPrompt;
    this.dynamicPrompt = new DynamicPrompt(this.component.content.dynamicPrompt);
  }

  protected onDynamicPromptChanged(feedbackRule: FeedbackRule): void {
    this.dynamicPromptChanged.emit(feedbackRule);
  }
}
