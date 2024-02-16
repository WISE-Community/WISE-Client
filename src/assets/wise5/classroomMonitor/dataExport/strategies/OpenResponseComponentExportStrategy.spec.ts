import { ComponentState } from '../../../../../app/domain/componentState';
import { ExportStrategyTester } from './ExportStrategyTester';
import { OpenResponseComponentDataExportStrategy } from './OpenResponseComponentExportStrategy';

const componentType = 'OpenResponse';
let exportStrategyTester: ExportStrategyTester = new ExportStrategyTester();
const itemId: string = 'COAL-II';
let studentData1: any;
let studentData2: any;
let studentData3: any;
let studentData4: any;
let componentState1: any;
let componentState2: any;
let componentState3: any;
let componentState4: any;

describe('OpenResponseComponentDataExportStrategy', () => {
  beforeEach(() => {
    exportStrategyTester = new ExportStrategyTester();
    exportStrategyTester.setUpServices();
    initializeStudentWork();
  });
  exportWithSingleAutoScore();
  exportWithMultipleSubScores();
  exportLatestRevisions();
  exportOnlySubmits();
});

function exportWithSingleAutoScore(): void {
  describe('open response export with single auto score', () => {
    it('generates export with auto score', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt,
        enableCRater: true,
        cRater: {
          itemId: itemId
        }
      });
      exportStrategyTester.setStudentData([componentState1, componentState2]);
      exportStrategyTester.setAnnotations([
        exportStrategyTester.createAnnotation(
          createAnnotationData(1, null, null),
          exportStrategyTester.studentWorkId1,
          exportStrategyTester.workgroupId1,
          'autoScore'
        ),
        exportStrategyTester.createAnnotation(
          createAnnotationData(2, null, null),
          exportStrategyTester.studentWorkId2,
          exportStrategyTester.workgroupId2,
          'autoScore'
        )
      ]);
      setUpExportStrategy('all');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd([
        'Item ID',
        'Response',
        'Auto Score'
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
            1,
            1,
            itemId,
            exportStrategyTester.studentWorkResponse1,
            1
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
            itemId,
            exportStrategyTester.studentWorkResponse2,
            2
          ]
        ],
        exportStrategyTester.createExpectedFileName('open_response')
      );
    });
  });
}

function exportWithMultipleSubScores(): void {
  describe('open response export with ideas and multiple sub scores', () => {
    it('generates export with multiple sub scores', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt,
        enableCRater: true,
        cRater: {
          itemId: itemId
        }
      });
      exportStrategyTester.setStudentData([componentState1, componentState2]);
      exportStrategyTester.setAnnotations([
        exportStrategyTester.createAnnotation(
          createAnnotationData(
            3,
            [
              { name: '1', detected: true },
              { name: '2', detected: true }
            ],
            [
              { id: 'ki', score: 3 },
              { id: 'science', score: 2 }
            ]
          ),
          exportStrategyTester.studentWorkId1,
          exportStrategyTester.workgroupId1,
          'autoScore'
        ),
        exportStrategyTester.createAnnotation(
          createAnnotationData(
            2,
            [
              { name: '1', detected: true },
              { name: '2', detected: false }
            ],
            [
              { id: 'ki', score: 2 },
              { id: 'science', score: 1 }
            ]
          ),
          exportStrategyTester.studentWorkId2,
          exportStrategyTester.workgroupId2,
          'autoScore'
        )
      ]);
      setUpExportStrategy('all');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd([
        'Item ID',
        'Response',
        'Idea 1',
        'Idea 2',
        'Score ki',
        'Score science'
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
            1,
            1,
            itemId,
            exportStrategyTester.studentWorkResponse1,
            1,
            1,
            3,
            2
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
            itemId,
            exportStrategyTester.studentWorkResponse2,
            1,
            0,
            2,
            1
          ]
        ],
        exportStrategyTester.createExpectedFileName('open_response')
      );
    });
  });
}

function exportLatestRevisions() {
  describe('open response export only latest revisions', () => {
    it('generates export with latest revisions', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt,
        enableCRater: true,
        cRater: {
          itemId: itemId
        }
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
        'Item ID',
        'Response',
        'Auto Score'
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
            0,
            1,
            itemId,
            exportStrategyTester.studentWorkResponse3,
            ''
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
            0,
            1,
            itemId,
            exportStrategyTester.studentWorkResponse4,
            ''
          ]
        ],
        exportStrategyTester.createExpectedFileName('open_response')
      );
    });
  });
}

function exportOnlySubmits(): void {
  describe('open response export only submits', () => {
    it('generates export with only submits', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt,
        enableCRater: true,
        cRater: {
          itemId: itemId
        }
      });
      exportStrategyTester.setStudentData([
        componentState1,
        componentState2,
        componentState3,
        componentState4
      ]);
      setUpExportStrategy('all', true);
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd([
        'Item ID',
        'Response',
        'Auto Score'
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
            1,
            1,
            itemId,
            exportStrategyTester.studentWorkResponse1,
            ''
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
            itemId,
            exportStrategyTester.studentWorkResponse2,
            ''
          ]
        ],
        exportStrategyTester.createExpectedFileName('open_response')
      );
    });
  });
}

function setUpExportStrategy(
  allOrLatest: 'all' | 'latest',
  includeOnlySubmits: boolean = false
): void {
  exportStrategyTester.setUpExportStrategy(
    new OpenResponseComponentDataExportStrategy(
      exportStrategyTester.nodeId,
      exportStrategyTester.component,
      exportStrategyTester.createComponentDataExportParams(true, includeOnlySubmits, true),
      allOrLatest
    )
  );
}

function initializeStudentWork(): void {
  studentData1 = {
    response: exportStrategyTester.studentWorkResponse1,
    submitCounter: 1
  };
  studentData2 = {
    response: exportStrategyTester.studentWorkResponse2,
    submitCounter: 1
  };
  studentData3 = {
    response: exportStrategyTester.studentWorkResponse3,
    submitCounter: 1
  };
  studentData4 = {
    response: exportStrategyTester.studentWorkResponse4,
    submitCounter: 1
  };
  componentState1 = createComponentState(
    exportStrategyTester.studentWorkId1,
    exportStrategyTester.studentWorkTimestampMilliseconds1,
    true,
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
    false,
    studentData3,
    exportStrategyTester.workgroupId1
  );
  componentState4 = createComponentState(
    exportStrategyTester.studentWorkId4,
    exportStrategyTester.studentWorkTimestampMilliseconds4,
    false,
    studentData4,
    exportStrategyTester.workgroupId2
  );
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

function createAnnotationData(value: number, ideas: any[], scores: any[]): any {
  return {
    ideas: ideas,
    scores: scores,
    value: value
  };
}
