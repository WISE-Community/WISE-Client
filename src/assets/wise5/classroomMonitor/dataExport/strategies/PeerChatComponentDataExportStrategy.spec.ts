import { PeerChatComponentDataExportStrategy } from './PeerChatComponentDataExportStrategy';
import { millisecondsToDateTime } from '../../../common/datetime/datetime';
import { ExportStrategyTester } from './ExportStrategyTester';
import { copy } from '../../../common/object/object';

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
const studentWorkId1 = 10000;
const studentWorkId2 = 10001;
const studentWorkResponse1 = 'Hello';
const studentWorkResponse2 = 'World';
const studentWorkTimestamp1 = millisecondsToDateTime(1577923200000);
const studentWorkTimestamp2 = millisecondsToDateTime(1578009600000);

describe('PeerChatComponentDataExportStrategy', () => {
  beforeEach(() => {
    exportStrategyTester = new ExportStrategyTester();
    exportStrategyTester.setUpServices();
  });
  describe('export', () => {
    exportWithRegularPrompt();
    exportWithDynamicPrompt();
    exportWithQuestionBank();
  });
});

function exportWithRegularPrompt(): void {
  describe('peer chat component with regular prompt', () => {
    it('generates export with correct rows of data', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt
      });
      exportStrategyTester.setStudentData([
        createPeerChatComponentState(
          studentWorkId1,
          exportStrategyTester.workgroupId1,
          peerGroupId1,
          studentWorkTimestamp1,
          { response: studentWorkResponse1 }
        ),
        createPeerChatComponentState(
          studentWorkId2,
          exportStrategyTester.workgroupId2,
          peerGroupId1,
          studentWorkTimestamp2,
          { response: studentWorkResponse2 }
        )
      ]);
      setUpExportStrategy();
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = createHeaderRow(['Prompt']);
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
            studentWorkTimestamp1,
            studentWorkTimestamp1,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentWorkResponse1
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
            studentWorkTimestamp2,
            studentWorkTimestamp2,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentWorkResponse2
          ]
        ],
        exportStrategyTester.createExpectedFileName('peer_chat')
      );
    });
  });
}

function exportWithDynamicPrompt(): void {
  describe('peer chat component with dynamic prompt', () => {
    it('generates export with correct data', () => {
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
          studentWorkId1,
          exportStrategyTester.workgroupId1,
          peerGroupId1,
          studentWorkTimestamp1,
          { response: studentWorkResponse1, dynamicPrompt: { prompt: dynamicPrompt1 } }
        ),
        createPeerChatComponentState(
          studentWorkId2,
          exportStrategyTester.workgroupId2,
          peerGroupId1,
          studentWorkTimestamp2,
          { response: studentWorkResponse2, dynamicPrompt: { prompt: dynamicPrompt2 } }
        )
      ]);
      setUpExportStrategy();
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = createHeaderRow(['Pre Prompt', 'Dynamic Prompt', 'Post Prompt']);
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
            studentWorkTimestamp1,
            studentWorkTimestamp1,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            prePrompt,
            dynamicPrompt1,
            postPrompt,
            studentWorkResponse1
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
            studentWorkTimestamp2,
            studentWorkTimestamp2,
            exportStrategyTester.nodeId,
            exportStrategyTester.componentId,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            prePrompt,
            dynamicPrompt2,
            postPrompt,
            studentWorkResponse2
          ]
        ],
        exportStrategyTester.createExpectedFileName('peer_chat')
      );
    });
  });
}

function exportWithQuestionBank(): void {
  describe('peer chat component with question bank', () => {
    it('generates export with correct data', () => {
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
          studentWorkId1,
          exportStrategyTester.workgroupId1,
          peerGroupId1,
          studentWorkTimestamp1,
          {
            response: studentWorkResponse1,
            questionBank: [
              {
                questions: [{ id: questionId1, text: question1 }]
              }
            ],
            questionId: questionId1
          }
        ),
        createPeerChatComponentState(
          studentWorkId2,
          exportStrategyTester.workgroupId2,
          peerGroupId1,
          studentWorkTimestamp2,
          {
            response: studentWorkResponse2,
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
      const headerRow = createHeaderRow(['Prompt', 'Question 1', 'Question 2', 'Question Used']);
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
            studentWorkTimestamp1,
            studentWorkTimestamp1,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            question1,
            '',
            question1,
            studentWorkResponse1
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
            studentWorkTimestamp2,
            studentWorkTimestamp2,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            question1,
            question2,
            question2,
            studentWorkResponse2
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
      exportStrategyTester.component
    )
  );
}

function createPeerChatComponentState(
  id: number,
  workgroupId: number,
  peerGroupId: number,
  timestamp: string,
  studentData: any
): any {
  return {
    id: id,
    workgroupId: workgroupId,
    peerGroupId: peerGroupId,
    clientSaveTime: timestamp,
    serverSaveTime: timestamp,
    studentData: studentData
  };
}

function createHeaderRow(additionalHeaderColumns: string[]): string[] {
  const headerRow = copy(exportStrategyTester.componentExportStrategy.defaultColumnNames);
  additionalHeaderColumns.forEach((columnName) => {
    headerRow.splice(headerRow.indexOf('Reponse'), 0, columnName);
  });
  return headerRow;
}
