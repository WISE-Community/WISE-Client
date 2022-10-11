import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CRaterResponse } from '../../components/common/cRater/CRaterResponse';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { FeedbackRuleEvaluator } from '../../components/common/feedbackRule/FeedbackRuleEvaluator';
import { FeedbackRuleComponent } from '../../components/feedbackRule/FeedbackRuleComponent';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { PeerGroupService } from '../../services/peerGroupService';
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
    private peerGroupService: PeerGroupService,
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
    if (this.dynamicPrompt.isPeerGroupingTagSpecified()) {
      this.evaluatePeerGroupOpenResponse(referenceComponent);
    } else {
      this.evaluatePersonalOpenResponse(referenceComponent);
    }
  }

  private evaluatePeerGroupOpenResponse(referenceComponent: any): void {
    const nodeId = this.dynamicPrompt.getReferenceNodeId();
    const componentId = referenceComponent.id;
    this.getPeerGroupData(nodeId, componentId).subscribe((peerGroupData: any[]) => {
      const cRaterResponses = peerGroupData.map((peerMemberData: any) => {
        return new CRaterResponse({
          ideas: peerMemberData.annotation.data.ideas,
          scores: peerMemberData.annotation.data.scores,
          submitCounter: this.getSubmitCounter(peerMemberData.componentState)
        });
      });
      const feedbackRuleEvaluator = this.getFeedbackRuleEvaluator(
        this.dynamicPrompt.getRules(),
        referenceComponent.maxSubmitCount
      );
      const feedbackRule: FeedbackRule = feedbackRuleEvaluator.getFeedbackRule(cRaterResponses);
      this.prompt = feedbackRule.prompt;
    });
  }

  private getPeerGroupData(nodeId: string, componentId: string): Observable<any[]> {
    return this.peerGroupService.retrievePeerGroup(this.dynamicPrompt.getPeerGroupingTag()).pipe(
      map((peerGroup) => {
        return this.createDummyData(nodeId, componentId, peerGroup);
      })
    );
  }

  private createDummyData(nodeId: string, componentId: string, peerGroup: any): any[] {
    const myWorkgroupId = this.configService.getWorkgroupId();
    return peerGroup.members.map((member: any) => {
      return {
        workgroupId: member.id,
        componentState: this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
          nodeId,
          componentId
        ),
        annotation: this.annotationService.getLatestScoreAnnotation(
          nodeId,
          componentId,
          myWorkgroupId,
          'autoScore'
        )
      };
    });
  }

  private evaluatePersonalOpenResponse(referenceComponent: any): void {
    const nodeId = this.dynamicPrompt.getReferenceNodeId();
    const componentId = referenceComponent.id;
    const latestComponentState = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    const latestAutoScoreAnnotation = this.annotationService.getLatestScoreAnnotation(
      nodeId,
      componentId,
      this.configService.getWorkgroupId(),
      'autoScore'
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
      this.prompt = feedbackRule.prompt;
    }
  }

  private getFeedbackRuleEvaluator(rules: FeedbackRule[], maxSubmitCount: number): any {
    return new FeedbackRuleEvaluator(new FeedbackRuleComponent(rules, maxSubmitCount, false));
  }

  private getSubmitCounter(componentState: any): number {
    return componentState.studentData.submitCounter;
  }
}
