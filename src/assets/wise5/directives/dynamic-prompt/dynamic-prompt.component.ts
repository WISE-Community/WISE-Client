import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { PeerGroupStudentData } from '../../../../app/domain/peerGroupStudentData';
import { CRaterResponse } from '../../components/common/cRater/CRaterResponse';
import { FeedbackRule } from '../../components/common/feedbackRule/FeedbackRule';
import { FeedbackRuleEvaluator } from '../../components/common/feedbackRule/FeedbackRuleEvaluator';
import { FeedbackRuleComponent } from '../../components/feedbackRule/FeedbackRuleComponent';
import { OpenResponseContent } from '../../components/openResponse/OpenResponseContent';
import { PeerGroup } from '../../components/peerChat/PeerGroup';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { PeerGroupService } from '../../services/peerGroupService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { DynamicPrompt } from './DynamicPrompt';
import { FeedbackRuleEvaluatorMultipleStudents } from '../../components/common/feedbackRule/FeedbackRuleEvaluatorMultipleStudents';
import { ConstraintService } from '../../services/constraintService';
import { Component as WISEComponent } from '../../common/Component';
import { Response } from '../../components/common/feedbackRule/Response';

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
    private constraintService: ConstraintService,
    private peerGroupService: PeerGroupService,
    private projectService: ProjectService,
    private dataService: StudentDataService
  ) {}

  ngOnInit(): void {
    const referenceComponent = this.getReferenceComponent(this.dynamicPrompt);
    if (referenceComponent.content.type === 'OpenResponse') {
      this.evaluateOpenResponseComponent(referenceComponent.content as OpenResponseContent);
    } else if (referenceComponent.content.type === 'MultipleChoice') {
      this.evaluateMultipleChoiceComponent(referenceComponent);
    }
  }

  private getReferenceComponent(dynamicPrompt: DynamicPrompt): WISEComponent {
    const nodeId = dynamicPrompt.getReferenceNodeId();
    const componentId = dynamicPrompt.getReferenceComponentId();
    return new WISEComponent(this.projectService.getComponent(nodeId, componentId), nodeId);
  }

  private evaluateOpenResponseComponent(referenceComponentContent: OpenResponseContent): void {
    if (this.dynamicPrompt.isPeerGroupingTagSpecified()) {
      this.evaluatePeerGroupOpenResponse(referenceComponentContent);
    } else {
      this.evaluatePersonalOpenResponse(referenceComponentContent);
    }
  }

  private evaluatePeerGroupOpenResponse(referenceComponentContent: OpenResponseContent): void {
    this.getPeerGroupData(
      this.dynamicPrompt.getPeerGroupingTag(),
      this.nodeId,
      this.componentId
    ).subscribe((peerGroupStudentData: PeerGroupStudentData[]) => {
      const cRaterResponses = peerGroupStudentData.map((peerMemberData: PeerGroupStudentData) => {
        return new CRaterResponse({
          ideas: peerMemberData.annotation.data.ideas,
          scores: peerMemberData.annotation.data.scores,
          submitCounter: this.getSubmitCounter(peerMemberData.studentWork)
        });
      });
      const feedbackRuleEvaluator = new FeedbackRuleEvaluatorMultipleStudents(
        new FeedbackRuleComponent(
          this.dynamicPrompt.getRules(),
          referenceComponentContent.maxSubmitCount,
          false
        ),
        this.constraintService
      );
      const feedbackRule: FeedbackRule = feedbackRuleEvaluator.getFeedbackRule(cRaterResponses);
      this.prompt = feedbackRule.prompt;
      this.dynamicPromptChanged.emit(feedbackRule); // TODO: change to two-way binding variable
    });
  }

  private getPeerGroupData(
    peerGroupingTag: string,
    nodeId: string,
    componentId: string
  ): Observable<PeerGroupStudentData[]> {
    return this.peerGroupService.retrievePeerGroup(peerGroupingTag).pipe(
      concatMap((peerGroup: PeerGroup) => {
        return this.peerGroupService
          .retrieveDynamicPromptStudentData(peerGroup.id, nodeId, componentId)
          .pipe(
            map((peerGroupStudentData: PeerGroupStudentData[]) => {
              return peerGroupStudentData;
            })
          );
      })
    );
  }

  private evaluatePersonalOpenResponse(referenceComponentContent: OpenResponseContent): void {
    const nodeId = this.dynamicPrompt.getReferenceNodeId();
    const componentId = referenceComponentContent.id;
    const latestComponentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
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
      const feedbackRuleEvaluator = new FeedbackRuleEvaluator(
        new FeedbackRuleComponent(
          this.dynamicPrompt.getRules(),
          referenceComponentContent.maxSubmitCount,
          false
        ),
        this.constraintService
      );
      const feedbackRule: FeedbackRule = feedbackRuleEvaluator.getFeedbackRule([cRaterResponse]);
      this.prompt = feedbackRule.prompt;
      this.dynamicPromptChanged.emit(feedbackRule);
    }
  }

  private evaluateMultipleChoiceComponent(referenceComponent: WISEComponent): void {
    if (this.dynamicPrompt.isPeerGroupingTagSpecified()) {
      this.evaluatePeerGroupMultipleChoice(referenceComponent);
    } else {
      this.evaluatePersonalMultipleChoice(referenceComponent);
    }
  }

  private evaluatePeerGroupMultipleChoice(referenceComponent: WISEComponent): void {
    this.getPeerGroupData(
      this.dynamicPrompt.getPeerGroupingTag(),
      this.nodeId,
      this.componentId
    ).subscribe((peerGroupStudentData: PeerGroupStudentData[]) => {
      const responses = peerGroupStudentData.map((peerMemberData: PeerGroupStudentData) => {
        return new Response({
          submitCounter: this.getSubmitCounter(peerMemberData.studentWork)
        });
      });
      const feedbackRuleEvaluator = new FeedbackRuleEvaluatorMultipleStudents(
        new FeedbackRuleComponent(
          this.dynamicPrompt.getRules(),
          referenceComponent.content.maxSubmitCount,
          false
        ),
        this.constraintService
      );
      feedbackRuleEvaluator.setReferenceComponent(referenceComponent);
      const feedbackRule: FeedbackRule = feedbackRuleEvaluator.getFeedbackRule(responses);
      this.prompt = feedbackRule.prompt;
      this.dynamicPromptChanged.emit(feedbackRule); // TODO: change to two-way binding variable
    });
  }

  private evaluatePersonalMultipleChoice(referenceComponent: WISEComponent): void {
    const feedbackRuleEvaluator = new FeedbackRuleEvaluator(
      new FeedbackRuleComponent(
        this.dynamicPrompt.getRules(),
        referenceComponent.content.maxSubmitCount,
        false
      ),
      this.constraintService
    );
    feedbackRuleEvaluator.setReferenceComponent(referenceComponent);
    const nodeId = this.dynamicPrompt.getReferenceNodeId();
    const componentId = referenceComponent.content.id;
    const latestComponentState = this.dataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    const response = new Response({
      submitCounter: this.getSubmitCounter(latestComponentState)
    });
    const feedbackRule: FeedbackRule = feedbackRuleEvaluator.getFeedbackRule([response]);
    this.prompt = feedbackRule.prompt;
    this.dynamicPromptChanged.emit(feedbackRule);
  }

  private getSubmitCounter(componentState: any): number {
    return componentState.studentData.submitCounter;
  }
}
