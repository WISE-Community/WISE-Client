import { PeerChatComponentDataExportStrategy } from './PeerChatComponentDataExportStrategy';
import { ExportStrategyTester } from './ExportStrategyTester';

const componentType = 'PeerChat';
const dynamicPrompt1 = 'This is the dynamic prompt 1.';
const dynamicPrompt2 = 'This is the dynamic prompt 2.';
let exportStrategyTester: ExportStrategyTester;
const peerGroupId1 = 10;
const postPrompt: string = 'This is the post prompt.';
const prePrompt: string = 'This is the pre prompt.';
const question1 = 'This is the first question.';
const question2 = 'This is the second question.';
const questionId1 = 'q1';
const questionId2 = 'q2';

describe('PeerChatComponentDataExportStrategy', () => {
  beforeEach(() => {
    exportStrategyTester = new ExportStrategyTester();
    exportStrategyTester.setUpServices();
  });
  exportWithRegularPrompt();
  exportWithDynamicPrompt();
  exportWithQuestionBank();
});

function exportWithRegularPrompt(): void {
  describe('peer chat component with regular prompt', () => {
    it('generates export with regular prompt', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt
      });
      exportStrategyTester.setStudentData([
        createPeerChatComponentState(
          exportStrategyTester.studentWorkId1,
          exportStrategyTester.workgroupId1,
          peerGroupId1,
          exportStrategyTester.studentWorkTimestampMilliseconds1,
          { response: exportStrategyTester.studentWorkResponse1 }
        ),
        createPeerChatComponentState(
          exportStrategyTester.studentWorkId2,
          exportStrategyTester.workgroupId2,
          peerGroupId1,
          exportStrategyTester.studentWorkTimestampMilliseconds2,
          { response: exportStrategyTester.studentWorkResponse2 }
        )
      ]);
      setUpExportStrategy();
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowInsertAdditionalColumnsBeforeResponse([
        'Prompt'
      ]);
      expect(
        exportStrategyTester.componentExportStrategy.controller.generateCSVFile
      ).toHaveBeenCalledWith(
        [
          headerRow,
          [
            1,
            peerGroupId1,
            exportStrategyTester.workgroupId1,
            exportStrategyTester.userId1,
            exportStrategyTester.studentName1,
            '',
            '',
            '',
            '',
            exportStrategyTester.periodName,
            exportStrategyTester.projectId,
            exportStrategyTester.projectTitle,
            exportStrategyTester.runId,
            exportStrategyTester.startDate,
            exportStrategyTester.endDate,
            exportStrategyTester.studentWorkTimestamp1,
            exportStrategyTester.studentWorkTimestamp1,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            exportStrategyTester.studentWorkResponse1
          ],
          [
            2,
            peerGroupId1,
            exportStrategyTester.workgroupId2,
            exportStrategyTester.userId2,
            exportStrategyTester.studentName2,
            '',
            '',
            '',
            '',
            exportStrategyTester.periodName,
            exportStrategyTester.projectId,
            exportStrategyTester.projectTitle,
            exportStrategyTester.runId,
            exportStrategyTester.startDate,
            exportStrategyTester.endDate,
            exportStrategyTester.studentWorkTimestamp2,
            exportStrategyTester.studentWorkTimestamp2,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            exportStrategyTester.studentWorkResponse2
          ]
        ],
        exportStrategyTester.createExpectedFileName('peer_chat')
      );
    });
  });
}

function exportWithDynamicPrompt(): void {
  describe('peer chat component with dynamic prompt', () => {
    it('generates export with dynamic prompt', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt,
        dynamicPrompt: {
          enabled: true,
          rules: [
            { id: 'r1', expression: '', prompt: dynamicPrompt1 },
            { id: 'r2', expression: '', prompt: dynamicPrompt2 }
          ],
          prePrompt: prePrompt,
          postPrompt: postPrompt
        }
      });
      exportStrategyTester.setStudentData([
        createPeerChatComponentState(
          exportStrategyTester.studentWorkId1,
          exportStrategyTester.workgroupId1,
          peerGroupId1,
          exportStrategyTester.studentWorkTimestampMilliseconds1,
          {
            response: exportStrategyTester.studentWorkResponse1,
            dynamicPrompt: { prompt: dynamicPrompt1 }
          }
        ),
        createPeerChatComponentState(
          exportStrategyTester.studentWorkId2,
          exportStrategyTester.workgroupId2,
          peerGroupId1,
          exportStrategyTester.studentWorkTimestampMilliseconds2,
          {
            response: exportStrategyTester.studentWorkResponse2,
            dynamicPrompt: { prompt: dynamicPrompt2 }
          }
        )
      ]);
      setUpExportStrategy();
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowInsertAdditionalColumnsBeforeResponse([
        'Pre Prompt',
        'Dynamic Prompt',
        'Post Prompt'
      ]);
      expect(
        exportStrategyTester.componentExportStrategy.controller.generateCSVFile
      ).toHaveBeenCalledWith(
        [
          headerRow,
          [
            1,
            peerGroupId1,
            exportStrategyTester.workgroupId1,
            exportStrategyTester.userId1,
            exportStrategyTester.studentName1,
            '',
            '',
            '',
            '',
            exportStrategyTester.periodName,
            exportStrategyTester.projectId,
            exportStrategyTester.projectTitle,
            exportStrategyTester.runId,
            exportStrategyTester.startDate,
            exportStrategyTester.endDate,
            exportStrategyTester.studentWorkTimestamp1,
            exportStrategyTester.studentWorkTimestamp1,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            prePrompt,
            dynamicPrompt1,
            postPrompt,
            exportStrategyTester.studentWorkResponse1
          ],
          [
            2,
            peerGroupId1,
            exportStrategyTester.workgroupId2,
            exportStrategyTester.userId2,
            exportStrategyTester.studentName2,
            '',
            '',
            '',
            '',
            exportStrategyTester.periodName,
            exportStrategyTester.projectId,
            exportStrategyTester.projectTitle,
            exportStrategyTester.runId,
            exportStrategyTester.startDate,
            exportStrategyTester.endDate,
            exportStrategyTester.studentWorkTimestamp2,
            exportStrategyTester.studentWorkTimestamp2,
            exportStrategyTester.nodeId,
            exportStrategyTester.componentId,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            prePrompt,
            dynamicPrompt2,
            postPrompt,
            exportStrategyTester.studentWorkResponse2
          ]
        ],
        exportStrategyTester.createExpectedFileName('peer_chat')
      );
    });
  });
}

function exportWithQuestionBank(): void {
  describe('peer chat component with question bank', () => {
    it('generates export with question columns', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt,
        questionBank: {
          enabled: true,
          clickToUseEnabled: true,
          rules: [
            { id: 'r1', expression: '', questions: [{ id: questionId1, text: question1 }] },
            { id: 'r2', expression: '', questions: [{ id: questionId2, text: question2 }] }
          ]
        }
      });
      exportStrategyTester.setStudentData([
        createPeerChatComponentState(
          exportStrategyTester.studentWorkId1,
          exportStrategyTester.workgroupId1,
          peerGroupId1,
          exportStrategyTester.studentWorkTimestampMilliseconds1,
          {
            response: exportStrategyTester.studentWorkResponse1,
            questionBank: [
              {
                questions: [{ id: questionId1, text: question1 }]
              }
            ],
            questionId: questionId1
          }
        ),
        createPeerChatComponentState(
          exportStrategyTester.studentWorkId2,
          exportStrategyTester.workgroupId2,
          peerGroupId1,
          exportStrategyTester.studentWorkTimestampMilliseconds2,
          {
            response: exportStrategyTester.studentWorkResponse2,
            questionBank: [
              {
                questions: [
                  { id: questionId1, text: question1 },
                  { id: questionId2, text: question2 }
                ]
              }
            ],
            questionId: questionId2
          }
        )
      ]);
      setUpExportStrategy();
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowInsertAdditionalColumnsBeforeResponse([
        'Prompt',
        'Question 1',
        'Question 2',
        'Question Used'
      ]);
      expect(
        exportStrategyTester.componentExportStrategy.controller.generateCSVFile
      ).toHaveBeenCalledWith(
        [
          headerRow,
          [
            1,
            peerGroupId1,
            exportStrategyTester.workgroupId1,
            exportStrategyTester.userId1,
            exportStrategyTester.studentName1,
            '',
            '',
            '',
            '',
            exportStrategyTester.periodName,
            exportStrategyTester.projectId,
            exportStrategyTester.projectTitle,
            exportStrategyTester.runId,
            exportStrategyTester.startDate,
            exportStrategyTester.endDate,
            exportStrategyTester.studentWorkTimestamp1,
            exportStrategyTester.studentWorkTimestamp1,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            question1,
            '',
            question1,
            exportStrategyTester.studentWorkResponse1
          ],
          [
            2,
            peerGroupId1,
            exportStrategyTester.workgroupId2,
            exportStrategyTester.userId2,
            exportStrategyTester.studentName2,
            '',
            '',
            '',
            '',
            exportStrategyTester.periodName,
            exportStrategyTester.projectId,
            exportStrategyTester.projectTitle,
            exportStrategyTester.runId,
            exportStrategyTester.startDate,
            exportStrategyTester.endDate,
            exportStrategyTester.studentWorkTimestamp2,
            exportStrategyTester.studentWorkTimestamp2,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            question1,
            question2,
            question2,
            exportStrategyTester.studentWorkResponse2
          ]
        ],
        exportStrategyTester.createExpectedFileName('peer_chat')
      );
    });
  });
}

function setUpExportStrategy(): void {
  exportStrategyTester.setUpExportStrategy(
    new PeerChatComponentDataExportStrategy(
      exportStrategyTester.nodeId,
      exportStrategyTester.component,
      exportStrategyTester.createComponentDataExportParams()
    )
  );
}

function createPeerChatComponentState(
  id: number,
  workgroupId: number,
  peerGroupId: number,
  timestamp: number,
  studentData: any
): any {
  const componentState = exportStrategyTester.createComponentState(
    componentType,
    id,
    timestamp,
    true,
    studentData,
    workgroupId
  );
  componentState.peerGroupId = peerGroupId;
  return componentState;
}
