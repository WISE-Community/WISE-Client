import { ComponentState } from '../../../../../app/domain/componentState';
import { ExportStrategyTester } from './ExportStrategyTester';
import { LabelComponentDataExportStrategy } from './LabelComponentDataExportStrategy';

const componentType = 'Label';
let exportStrategyTester: ExportStrategyTester = new ExportStrategyTester();
let studentData1: any;
let studentData2: any;
let studentData3: any;
let studentData4: any;
let componentState1: any;
let componentState2: any;
let componentState3: any;
let componentState4: any;

describe('LabelComponentDataExportStrategy', () => {
  beforeEach(() => {
    exportStrategyTester = new ExportStrategyTester();
    exportStrategyTester.setUpServices();
    initializeStudentWork();
  });
  exportAllRevisions();
  exportLatestRevisions();
});

function exportAllRevisions(): void {
  describe('export all revisions', () => {
    it('generates export with all revisions', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt
      });
      exportStrategyTester.setStudentData([
        componentState1,
        componentState2,
        componentState3,
        componentState4
      ]);
      setUpExportStrategy('all');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd([
        'Label 1',
        'Label 2'
      ]);
      expect(exportStrategyTester.componentExportStrategy.generateCSVFile).toHaveBeenCalledWith(
        [
          headerRow,
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
            exportStrategyTester.studentWorkId1,
            exportStrategyTester.studentWorkTimestamp1,
            exportStrategyTester.studentWorkTimestamp1,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentData1,
            1,
            0,
            0,
            exportStrategyTester.studentWorkResponse1,
            ''
          ],
          [
            2,
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
            exportStrategyTester.studentWorkId3,
            exportStrategyTester.studentWorkTimestamp3,
            exportStrategyTester.studentWorkTimestamp3,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentData3,
            2,
            1,
            1,
            exportStrategyTester.studentWorkResponse1,
            exportStrategyTester.studentWorkResponse2
          ],
          [
            3,
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
            exportStrategyTester.studentWorkId2,
            exportStrategyTester.studentWorkTimestamp2,
            exportStrategyTester.studentWorkTimestamp2,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentData2,
            1,
            1,
            1,
            exportStrategyTester.studentWorkResponse3,
            ''
          ],
          [
            4,
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
            exportStrategyTester.studentWorkId4,
            exportStrategyTester.studentWorkTimestamp4,
            exportStrategyTester.studentWorkTimestamp4,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentData4,
            2,
            1,
            2,
            exportStrategyTester.studentWorkResponse3,
            exportStrategyTester.studentWorkResponse4
          ]
        ],
        exportStrategyTester.createExpectedFileName('label')
      );
    });
  });
}

function exportLatestRevisions(): void {
  describe('export latest revisions', () => {
    it('generates export with latest revisions', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt
      });
      exportStrategyTester.setStudentData([
        componentState1,
        componentState2,
        componentState3,
        componentState4
      ]);
      setUpExportStrategy('latest');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd([
        'Label 1',
        'Label 2'
      ]);
      expect(exportStrategyTester.componentExportStrategy.generateCSVFile).toHaveBeenCalledWith(
        [
          headerRow,
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
            exportStrategyTester.studentWorkId3,
            exportStrategyTester.studentWorkTimestamp3,
            exportStrategyTester.studentWorkTimestamp3,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentData3,
            2,
            1,
            1,
            exportStrategyTester.studentWorkResponse1,
            exportStrategyTester.studentWorkResponse2
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
            exportStrategyTester.studentWorkId4,
            exportStrategyTester.studentWorkTimestamp4,
            exportStrategyTester.studentWorkTimestamp4,
            exportStrategyTester.nodeId,
            exportStrategyTester.component.id,
            exportStrategyTester.componentPartNumber,
            exportStrategyTester.nodePositionAndTitle,
            exportStrategyTester.component.type,
            exportStrategyTester.component.prompt,
            studentData4,
            2,
            1,
            2,
            exportStrategyTester.studentWorkResponse3,
            exportStrategyTester.studentWorkResponse4
          ]
        ],
        exportStrategyTester.createExpectedFileName('label')
      );
    });
  });
}

function setUpExportStrategy(allOrLatest: 'all' | 'latest'): void {
  exportStrategyTester.setUpExportStrategy(
    new LabelComponentDataExportStrategy(
      exportStrategyTester.nodeId,
      exportStrategyTester.component,
      exportStrategyTester.createComponentDataExportParams(),
      allOrLatest
    )
  );
}

function initializeStudentWork(): void {
  studentData1 = {
    labels: createLabels([exportStrategyTester.studentWorkResponse1]),
    submitCounter: 0
  };
  studentData2 = {
    labels: createLabels([exportStrategyTester.studentWorkResponse3]),
    submitCounter: 1
  };
  studentData3 = {
    labels: createLabels([
      exportStrategyTester.studentWorkResponse1,
      exportStrategyTester.studentWorkResponse2
    ]),
    submitCounter: 1
  };
  studentData4 = {
    labels: createLabels([
      exportStrategyTester.studentWorkResponse3,
      exportStrategyTester.studentWorkResponse4
    ]),
    submitCounter: 2
  };
  componentState1 = createComponentState(
    exportStrategyTester.studentWorkId1,
    exportStrategyTester.studentWorkTimestampMilliseconds1,
    false,
    studentData1,
    exportStrategyTester.workgroupId1
  );
  componentState2 = createComponentState(
    exportStrategyTester.studentWorkId2,
    exportStrategyTester.studentWorkTimestampMilliseconds2,
    true,
    studentData2,
    exportStrategyTester.workgroupId2
  );
  componentState3 = createComponentState(
    exportStrategyTester.studentWorkId3,
    exportStrategyTester.studentWorkTimestampMilliseconds3,
    true,
    studentData3,
    exportStrategyTester.workgroupId1
  );
  componentState4 = createComponentState(
    exportStrategyTester.studentWorkId4,
    exportStrategyTester.studentWorkTimestampMilliseconds4,
    true,
    studentData4,
    exportStrategyTester.workgroupId2
  );
}

function createLabels(labelTexts: string[]): any[] {
  return labelTexts.map((labelText: string) => createLabel(labelText));
}

function createLabel(text: string): any {
  return {
    text: text
  };
}

function createComponentState(
  studentWorkId: number,
  timestamp: number,
  isSubmit: boolean,
  studentData: any,
  workgroupId: number
): ComponentState {
  return exportStrategyTester.createComponentState(
    componentType,
    studentWorkId,
    timestamp,
    isSubmit,
    studentData,
    workgroupId
  );
}
