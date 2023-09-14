export function getQuestionIdsUsed(componentStates: any[], workgroupId: number): string[] {
  return componentStates
    .filter((componentState) => componentState.workgroupId === workgroupId)
    .filter((componentState) => componentState.studentData.questionId != null)
    .map((componentState) => componentState.studentData.questionId);
}
