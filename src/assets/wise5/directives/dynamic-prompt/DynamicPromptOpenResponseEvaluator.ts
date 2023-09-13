import { PeerGroupStudentData } from '../../../../app/domain/peerGroupStudentData';
import { Component } from '../../common/Component';
import { CRaterResponse } from '../../components/common/cRater/CRaterResponse';
import { DynamicPromptEvaluator } from './DynamicPromptEvaluator';

export class DynamicPromptOpenResponseEvaluator extends DynamicPromptEvaluator {
  evaluatePeerGroup(referenceComponent: Component): void {
    this.getPeerGroupData().subscribe((peerGroupStudentData: PeerGroupStudentData[]) => {
      const cRaterResponses = peerGroupStudentData.map((peerMemberData: PeerGroupStudentData) => {
        return new CRaterResponse({
          ideas: peerMemberData.annotation.data.ideas,
          scores: peerMemberData.annotation.data.scores,
          submitCounter: this.getSubmitCounter(peerMemberData.studentWork)
        });
      });
      const feedbackRuleEvaluator = this.getFeedbackRuleEvaluator(referenceComponent);
      this.setPromptAndEmitRule(feedbackRuleEvaluator.getFeedbackRule(cRaterResponses));
    });
  }

  evaluatePersonal(referenceComponent: Component): void {
    const nodeId = this.component.dynamicPrompt.getReferenceNodeId();
    const componentId = referenceComponent.content.id;
    const latestComponentState = this.component.dataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    const latestAutoScoreAnnotation = this.component.annotationService.getLatestScoreAnnotation(
      nodeId,
      componentId,
      this.component.configService.getWorkgroupId(),
      'autoScore'
    );
    if (latestComponentState != null && latestAutoScoreAnnotation != null) {
      const cRaterResponse = new CRaterResponse({
        ideas: latestAutoScoreAnnotation.data.ideas,
        scores: latestAutoScoreAnnotation.data.scores,
        submitCounter: this.getSubmitCounter(latestComponentState)
      });
      const feedbackRuleEvaluator = this.getFeedbackRuleEvaluator(referenceComponent);
      this.setPromptAndEmitRule(feedbackRuleEvaluator.getFeedbackRule([cRaterResponse]));
    }
  }
}
