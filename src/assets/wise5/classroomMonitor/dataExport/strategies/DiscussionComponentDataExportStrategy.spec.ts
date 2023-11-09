import { DiscussionComponentDataExportStrategy } from './DiscussionComponentDataExportStrategy';
import { ExportStrategyTester } from './ExportStrategyTester';

let exportStrategyTester: ExportStrategyTester;
const studentWorkId1 = 10000;
const studentWorkId2 = 10001;
const studentWorkResponse1 = 'Hello';
const studentWorkResponse2 = 'World';
const studentData1 = { response: studentWorkResponse1 };
const studentData2 = { componentStateIdReplyingTo: studentWorkId1, response: studentWorkResponse2 };

describe('DiscussionComponentDataExportStrategy', () => {
  beforeEach(() => {
    exportStrategyTester = new ExportStrategyTester();
    exportStrategyTester.setUpServices();
  });
  describe('export', () => {
    it('generates export with correct rows of data', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: 'Discussion',
        prompt: exportStrategyTester.componentPrompt
      });
      exportStrategyTester.setStudentData([
        createDiscussionComponentState(
          studentWorkId1,
          exportStrategyTester.workgroupId1,
          studentData1
        ),
        createDiscussionComponentState(
          studentWorkId2,
          exportStrategyTester.workgroupId2,
          studentData2
        )
      ]);
      setUpExportStrategy();
      exportStrategyTester.componentExportStrategy.export();
      expect(
        exportStrategyTester.componentExportStrategy.controller.generateCSVFile
      ).toHaveBeenCalledWith(
        [
          exportStrategyTester.componentExportStrategy.defaultDiscussionColumnNames,
          [
            1,
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
            '',
            '',
            '',
            '',
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentData1,
            studentWorkId1,
            studentWorkId1,
            1,
            studentWorkResponse1
          ],
          [
            2,
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
            '',
            '',
            '',
            '',
            exportStrategyTester.nodeId,
            exportStrategyTester.componentId,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentData2,
            studentWorkId1,
            studentWorkId2,
            2,
            studentWorkResponse2
          ]
        ],
        exportStrategyTester.createExpectedFileName('discussion')
      );
    });
  });
});

function setUpExportStrategy(): void {
  exportStrategyTester.setUpExportStrategy(
    new DiscussionComponentDataExportStrategy(
      exportStrategyTester.nodeId,
      exportStrategyTester.component
    )
  );
}

function createDiscussionComponentState(id: number, workgroupId: number, studentData: any): any {
  return {
    id: id,
    workgroupId: workgroupId,
    studentData: studentData
  };
}
