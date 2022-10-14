import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { CRaterResponse } from '../../components/common/cRater/CRaterResponse';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { FeedbackRuleEvaluator } from '../../components/common/feedbackRule/FeedbackRuleEvaluator';
import { FeedbackRuleComponent } from '../../components/feedbackRule/FeedbackRuleComponent';
import { PeerGroup } from '../../components/peerChat/PeerGroup';
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
  @Input() componentId: string;
  @Input() dynamicPrompt: DynamicPrompt;
  @Output() dynamicPromptChanged: EventEmitter<FeedbackRule> = new EventEmitter<FeedbackRule>();
  @Input() nodeId: string;
  prompt: string;

  constructor(
    private annotationService: AnnotationService,
    private configService: ConfigService,
    private peerGroupService: PeerGroupService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    const referenceComponentContent = this.getReferenceComponent(this.dynamicPrompt);
    if (referenceComponentContent.type === 'OpenResponse') {
      this.evaluateOpenResponseComponent(referenceComponentContent);
    }
  }

  private getReferenceComponent(dynamicPrompt: DynamicPrompt): any {
    const nodeId = dynamicPrompt.getReferenceNodeId();
    const componentId = dynamicPrompt.getReferenceComponentId();
    return this.projectService.getComponentByNodeIdAndComponentId(nodeId, componentId);
  }

  private evaluateOpenResponseComponent(referenceComponentContent: any): void {
    if (this.dynamicPrompt.isPeerGroupingTagSpecified()) {
      this.evaluatePeerGroupOpenResponse(referenceComponentContent);
    } else {
      this.evaluatePersonalOpenResponse(referenceComponentContent);
    }
  }

  private evaluatePeerGroupOpenResponse(referenceComponentContent: any): void {
    this.getPeerGroupData(
      this.dynamicPrompt.getPeerGroupingTag(),
      this.nodeId,
      this.componentId
    ).subscribe((peerGroupData: any[]) => {
      const cRaterResponses = peerGroupData.map((peerMemberData: any) => {
        return new CRaterResponse({
          ideas: peerMemberData.annotation.data.ideas,
          scores: peerMemberData.annotation.data.scores,
          submitCounter: this.getSubmitCounter(peerMemberData.studentWork)
        });
      });
      const feedbackRuleEvaluator = this.getFeedbackRuleEvaluator(
        this.dynamicPrompt.getRules(),
        referenceComponentContent.maxSubmitCount
      );
      const feedbackRule: FeedbackRule = feedbackRuleEvaluator.getFeedbackRule(cRaterResponses);
      this.prompt = feedbackRule.prompt;
      this.dynamicPromptChanged.emit(feedbackRule);
    });
  }

  private getPeerGroupData(
    peerGroupingTag: string,
    nodeId: string,
    componentId: string
  ): Observable<any[]> {
    return this.peerGroupService.retrievePeerGroup(peerGroupingTag).pipe(
      concatMap((peerGroup: PeerGroup) => {
        return this.peerGroupService
          .retrieveDynamicPromptStudentData(peerGroup.id, nodeId, componentId)
          .pipe(
            map((studentData) => {
              return studentData;
            })
          );
      })
    );
  }

  private evaluatePersonalOpenResponse(referenceComponentContent: any): void {
    const nodeId = this.dynamicPrompt.getReferenceNodeId();
    const componentId = referenceComponentContent.id;
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
        referenceComponentContent.maxSubmitCount
      );
      const feedbackRule: FeedbackRule = feedbackRuleEvaluator.getFeedbackRule(cRaterResponse);
      this.prompt = feedbackRule.prompt;
      this.dynamicPromptChanged.emit(feedbackRule);
    }
  }

  private getFeedbackRuleEvaluator(rules: FeedbackRule[], maxSubmitCount: number): any {
    return new FeedbackRuleEvaluator(new FeedbackRuleComponent(rules, maxSubmitCount, false));
  }

  private getSubmitCounter(componentState: any): number {
    return componentState.studentData.submitCounter;
  }
}
