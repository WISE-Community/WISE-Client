import { DiscussionComponentDataExportStrategy } from './DiscussionComponentDataExportStrategy';
import { ExportStrategyTester } from './ExportStrategyTester';

const componentType: string = 'Discussion';
let exportStrategyTester: ExportStrategyTester;
let studentData1: any;
let studentData2: any;

describe('DiscussionComponentDataExportStrategy', () => {
  beforeEach(() => {
    exportStrategyTester = new ExportStrategyTester();
    exportStrategyTester.setUpServices();
    initializeStudentWork();
  });
  describe('export', () => {
    it('generates export with correct rows of data', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt
      });
      exportStrategyTester.setStudentData([
        exportStrategyTester.createComponentState(
          componentType,
          exportStrategyTester.studentWorkId1,
          exportStrategyTester.studentWorkTimestampMilliseconds1,
          true,
          studentData1,
          exportStrategyTester.workgroupId1
        ),
        exportStrategyTester.createComponentState(
          componentType,
          exportStrategyTester.studentWorkId2,
          exportStrategyTester.studentWorkTimestampMilliseconds2,
          true,
          studentData2,
          exportStrategyTester.workgroupId2
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
            studentData1,
            exportStrategyTester.studentWorkId1,
            exportStrategyTester.studentWorkId1,
            1,
            exportStrategyTester.studentWorkResponse1
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
            exportStrategyTester.startDate,
            exportStrategyTester.endDate,
            exportStrategyTester.studentWorkTimestamp2,
            exportStrategyTester.studentWorkTimestamp2,
            exportStrategyTester.nodeId,
            exportStrategyTester.componentId,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentData2,
            exportStrategyTester.studentWorkId1,
            exportStrategyTester.studentWorkId2,
            2,
            exportStrategyTester.studentWorkResponse2
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
      exportStrategyTester.component,
      exportStrategyTester.createComponentDataExportParams()
    )
  );
}

function initializeStudentWork(): void {
  studentData1 = { response: exportStrategyTester.studentWorkResponse1 };
  studentData2 = {
    componentStateIdReplyingTo: exportStrategyTester.studentWorkId1,
    response: exportStrategyTester.studentWorkResponse2
  };
}
