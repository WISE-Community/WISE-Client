import { Component, Input, OnInit } from '@angular/core';
import { CRaterResponse } from '../../components/common/cRater/CRaterResponse';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { FeedbackRuleEvaluator } from '../../components/common/feedbackRule/FeedbackRuleEvaluator';
import { FeedbackRuleComponent } from '../../components/feedbackRule/FeedbackRuleComponent';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { DynamicPrompt } from './DynamicPrompt';

@Component({
  selector: 'dynamic-prompt',
  templateUrl: './dynamic-prompt.component.html',
  styleUrls: ['./dynamic-prompt.component.scss']
})
export class DynamicPromptComponent implements OnInit {
  @Input() dynamicPrompt: DynamicPrompt;
  prompt: string;
  constructor(
    private annotationService: AnnotationService,
    private configService: ConfigService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    const referenceComponent = this.getReferenceComponent(this.dynamicPrompt);
    if (referenceComponent.type === 'OpenResponse') {
      this.evaluateOpenResponseComponent(referenceComponent);
    }
  }

  private getReferenceComponent(dynamicPrompt: DynamicPrompt): any {
    const nodeId = dynamicPrompt.getReferenceNodeId();
    const componentId = dynamicPrompt.getReferenceComponentId();
    return this.projectService.getComponentByNodeIdAndComponentId(nodeId, componentId);
  }

  private evaluateOpenResponseComponent(referenceComponent: any): void {
    const nodeId = this.dynamicPrompt.getReferenceNodeId();
    const componentId = referenceComponent.id;
    const latestComponentState = this.getLatestComponentState(nodeId, componentId);
    const latestAutoScoreAnnotation = this.getLatestAutoScore(
      nodeId,
      componentId,
      this.configService.getWorkgroupId()
    );
    if (latestComponentState != null && latestAutoScoreAnnotation != null) {
      const cRaterResponse = new CRaterResponse({
        ideas: latestAutoScoreAnnotation.data.ideas,
        scores: latestAutoScoreAnnotation.data.scores,
        submitCounter: this.getSubmitCounter(latestComponentState)
      });
      const feedbackRuleEvaluator = this.getFeedbackRuleEvaluator(
        this.dynamicPrompt.getRules(),
        referenceComponent.maxSubmitCount
      );
      const feedbackRule: FeedbackRule = feedbackRuleEvaluator.getFeedbackRule(cRaterResponse);
      this.setPrompt(feedbackRule.prompt);
    }
  }

  private getLatestComponentState(nodeId: string, componentId: string): any {
    return this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
  }

  private getLatestAutoScore(nodeId: string, componentId: string, workgroupId: number): any {
    return this.annotationService.getLatestScoreAnnotation(
      nodeId,
      componentId,
      workgroupId,
      'autoScore'
    );
  }

  private getFeedbackRuleEvaluator(rules: FeedbackRule[], maxSubmitCount: number): any {
    return new FeedbackRuleEvaluator(new FeedbackRuleComponent(rules, maxSubmitCount, false));
  }

  private getSubmitCounter(componentState: any): number {
    return componentState.studentData.submitCounter;
  }

  private setPrompt(prompt: string): void {
    this.prompt = prompt;
  }
}
