import { PeerGroupStudentData } from '../../../../app/domain/peerGroupStudentData';
import { Component } from '../../common/Component';
import { Response } from '../../components/common/feedbackRule/Response';
import { DynamicPromptEvaluator } from './DynamicPromptEvaluator';

export class DynamicPromptMultipleChoiceEvaluator extends DynamicPromptEvaluator {
  evaluatePeerGroup(referenceComponent: Component): void {
    this.getPeerGroupData().subscribe((peerGroupStudentData: PeerGroupStudentData[]) => {
      const responses = peerGroupStudentData.map((peerMemberData: PeerGroupStudentData) => {
        return new Response({
          submitCounter: this.getSubmitCounter(peerMemberData.studentWork)
        });
      });
      const feedbackRuleEvaluator = this.getFeedbackRuleEvaluator(referenceComponent);
      feedbackRuleEvaluator.setPeerGroup(this.component.peerGroup);
      this.setPromptAndEmitRule(feedbackRuleEvaluator.getFeedbackRule(responses));
    });
  }

  evaluatePersonal(referenceComponent: Component): void {
    const feedbackRuleEvaluator = this.getFeedbackRuleEvaluator(referenceComponent);
    const nodeId = this.component.dynamicPrompt.getReferenceNodeId();
    const componentId = referenceComponent.content.id;
    const latestComponentState = this.component.dataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    const response = new Response({
      submitCounter: this.getSubmitCounter(latestComponentState)
    });
    this.setPromptAndEmitRule(feedbackRuleEvaluator.getFeedbackRule([response]));
  }
}
