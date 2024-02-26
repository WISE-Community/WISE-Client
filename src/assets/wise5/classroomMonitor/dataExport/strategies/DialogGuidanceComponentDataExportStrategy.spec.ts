import { ComponentState } from '../../../../../app/domain/componentState';
import { DialogGuidanceComponentDataExportStrategy } from './DialogGuidanceComponentDataExportStrategy';
import { ExportStrategyTester } from './ExportStrategyTester';

let componentState1: any;
let componentState2: any;
let componentState3: any;
let componentState4: any;
const componentType = 'DialogGuidance';
const computerText1: string = 'Computer Text 1';
const computerText2: string = 'Computer Text 2';
const computerText3: string = 'Computer Text 3';
const computerText4: string = 'Computer Text 4';
let exportStrategyTester: ExportStrategyTester = new ExportStrategyTester();
const itemId: string = 'TestItem';
const nonscorableScore: number = 1;
let studentData1: any;
let studentData2: any;
let studentData3: any;
let studentData4: any;
const studentResponseIdeas1: any = {
  '1': true,
  '2': false,
  '2a': false,
  '3': false
};
const studentResponseIdeas2: any = {
  '1': false,
  '2': true,
  '2a': false,
  '3': false
};
const studentResponseIdeas3: any = {
  '1': false,
  '2': false,
  '2a': false,
  '3': true
};
const studentResponseIdeas4: any = {
  '1': true,
  '2': true,
  '2a': true,
  '3': true
};
const studentResponseScore1: number = 1;
const studentResponseScore2: number = 2;
const studentResponseScore3: number = 3;
const studentResponseScore4: number = 4;
const studentText1: string = 'Student Text 1';
const studentText2: string = 'Student Text 2';
const studentText3: string = 'Student Text 3';
const studentText4: string = 'Student Text 4';

describe('DialogGuidanceComponentDataExportStrategy', () => {
  beforeEach(() => {
    exportStrategyTester = new ExportStrategyTester();
    exportStrategyTester.setUpServices();
    initializeStudentWork();
  });
  exportAllRevisions();
  exportLatestRevisions();
  exportItemWithSingleScore();
});

function exportAllRevisions(): void {
  describe('export all revisions', () => {
    it('exports all revisions', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt,
        itemId: itemId
      });
      exportStrategyTester.setStudentData([
        componentState1,
        componentState2,
        componentState3,
        componentState4
      ]);
      setUpExportStrategy('all');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd(
        generateAdditionalHeaderColumns(2)
      );
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
            studentText1,
            studentResponseIdeas1['1'] ? 1 : 0,
            studentResponseIdeas1['2'] ? 1 : 0,
            studentResponseIdeas1['2a'] ? 1 : 0,
            studentResponseIdeas1['3'] ? 1 : 0,
            studentResponseScore1,
            nonscorableScore,
            computerText1,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
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
            2,
            itemId,
            studentText1,
            studentResponseIdeas1['1'] ? 1 : 0,
            studentResponseIdeas1['2'] ? 1 : 0,
            studentResponseIdeas1['2a'] ? 1 : 0,
            studentResponseIdeas1['3'] ? 1 : 0,
            studentResponseScore1,
            nonscorableScore,
            computerText1,
            studentText3,
            studentResponseIdeas3['1'] ? 1 : 0,
            studentResponseIdeas3['2'] ? 1 : 0,
            studentResponseIdeas3['2a'] ? 1 : 0,
            studentResponseIdeas3['3'] ? 1 : 0,
            studentResponseScore3,
            nonscorableScore,
            computerText3
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
            itemId,
            studentText2,
            studentResponseIdeas2['1'] ? 1 : 0,
            studentResponseIdeas2['2'] ? 1 : 0,
            studentResponseIdeas2['2a'] ? 1 : 0,
            studentResponseIdeas2['3'] ? 1 : 0,
            studentResponseScore2,
            nonscorableScore,
            computerText2,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
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
            itemId,
            studentText2,
            studentResponseIdeas2['1'] ? 1 : 0,
            studentResponseIdeas2['2'] ? 1 : 0,
            studentResponseIdeas2['2a'] ? 1 : 0,
            studentResponseIdeas2['3'] ? 1 : 0,
            studentResponseScore2,
            nonscorableScore,
            computerText2,
            studentText4,
            studentResponseIdeas4['1'] ? 1 : 0,
            studentResponseIdeas4['2'] ? 1 : 0,
            studentResponseIdeas4['2a'] ? 1 : 0,
            studentResponseIdeas4['3'] ? 1 : 0,
            studentResponseScore4,
            nonscorableScore,
            computerText4
          ]
        ],
        exportStrategyTester.createExpectedFileName('dialog_guidance')
      );
    });
  });
}

function exportLatestRevisions(): void {
  describe('export latest revisions', () => {
    it('exports latest revisions', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt,
        itemId: itemId
      });
      exportStrategyTester.setStudentData([
        componentState1,
        componentState2,
        componentState3,
        componentState4
      ]);
      setUpExportStrategy('latest');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd(
        generateAdditionalHeaderColumns(2)
      );
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
            2,
            itemId,
            studentText1,
            studentResponseIdeas1['1'] ? 1 : 0,
            studentResponseIdeas1['2'] ? 1 : 0,
            studentResponseIdeas1['2a'] ? 1 : 0,
            studentResponseIdeas1['3'] ? 1 : 0,
            studentResponseScore1,
            nonscorableScore,
            computerText1,
            studentText3,
            studentResponseIdeas3['1'] ? 1 : 0,
            studentResponseIdeas3['2'] ? 1 : 0,
            studentResponseIdeas3['2a'] ? 1 : 0,
            studentResponseIdeas3['3'] ? 1 : 0,
            studentResponseScore3,
            nonscorableScore,
            computerText3
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
            itemId,
            studentText2,
            studentResponseIdeas2['1'] ? 1 : 0,
            studentResponseIdeas2['2'] ? 1 : 0,
            studentResponseIdeas2['2a'] ? 1 : 0,
            studentResponseIdeas2['3'] ? 1 : 0,
            studentResponseScore2,
            nonscorableScore,
            computerText2,
            studentText4,
            studentResponseIdeas4['1'] ? 1 : 0,
            studentResponseIdeas4['2'] ? 1 : 0,
            studentResponseIdeas4['2a'] ? 1 : 0,
            studentResponseIdeas4['3'] ? 1 : 0,
            studentResponseScore4,
            nonscorableScore,
            computerText4
          ]
        ],
        exportStrategyTester.createExpectedFileName('dialog_guidance')
      );
    });
  });
}

function exportItemWithSingleScore(): void {
  describe('export item with single score', () => {
    it('exports with single score column', () => {
      exportStrategyTester.setComponent({
        id: exportStrategyTester.componentId,
        type: componentType,
        prompt: exportStrategyTester.componentPrompt,
        itemId: itemId
      });
      delete componentState1.studentData.responses[1].ideas;
      delete componentState1.studentData.responses[1].scores;
      componentState1.studentData.responses[1].score = studentResponseScore1;
      exportStrategyTester.setStudentData([componentState1]);
      setUpExportStrategy('all');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd(
        generateAdditionalHeaderColumnsForSingleScore(1)
      );
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
            studentText1,
            studentResponseScore1,
            computerText1
          ]
        ],
        exportStrategyTester.createExpectedFileName('dialog_guidance')
      );
    });
  });
}

function setUpExportStrategy(
  allOrLatest: 'all' | 'latest',
  includeOnlySubmits: boolean = false
): void {
  exportStrategyTester.setUpExportStrategy(
    new DialogGuidanceComponentDataExportStrategy(
      exportStrategyTester.nodeId,
      exportStrategyTester.component,
      exportStrategyTester.createComponentDataExportParams(true, includeOnlySubmits, true),
      allOrLatest
    )
  );
}

function generateAdditionalHeaderColumns(numStudentResponses: number): string[] {
  const additionalColumns = ['Item ID'];
  for (let i = 1; i <= numStudentResponses; i++) {
    additionalColumns.push(`Student Response ${i}`);
    additionalColumns.push(`Idea 1 Response ${i}`);
    additionalColumns.push(`Idea 2 Response ${i}`);
    additionalColumns.push(`Idea 2a Response ${i}`);
    additionalColumns.push(`Idea 3 Response ${i}`);
    additionalColumns.push(`Score ki Response ${i}`);
    additionalColumns.push(`Score nonscorable Response ${i}`);
    additionalColumns.push(`Computer Response ${i}`);
  }
  return additionalColumns;
}

function generateAdditionalHeaderColumnsForSingleScore(numStudentResponses: number): string[] {
  const additionalColumns = ['Item ID'];
  for (let i = 1; i <= numStudentResponses; i++) {
    additionalColumns.push(`Student Response ${i}`);
    additionalColumns.push(`Score Response ${i}`);
    additionalColumns.push(`Computer Response ${i}`);
  }
  return additionalColumns;
}

function initializeStudentWork(): void {
  const studentResponses1 = [
    generateStudentResponse(studentText1),
    generateComputerResponse(computerText1, studentResponseIdeas1, {
      ki: studentResponseScore1,
      nonscorable: nonscorableScore
    })
  ];
  const studentResponses2 = [
    generateStudentResponse(studentText2),
    generateComputerResponse(computerText2, studentResponseIdeas2, {
      ki: studentResponseScore2,
      nonscorable: nonscorableScore
    })
  ];
  const studentResponses3 = [
    generateStudentResponse(studentText3),
    generateComputerResponse(computerText3, studentResponseIdeas3, {
      ki: studentResponseScore3,
      nonscorable: nonscorableScore
    })
  ];
  const studentResponses4 = [
    generateStudentResponse(studentText4),
    generateComputerResponse(computerText4, studentResponseIdeas4, {
      ki: studentResponseScore4,
      nonscorable: nonscorableScore
    })
  ];
  studentData1 = generateStudentData([...studentResponses1], 1);
  studentData2 = generateStudentData([...studentResponses2], 1);
  studentData3 = generateStudentData([...studentResponses1, ...studentResponses3], 2);
  studentData4 = generateStudentData([...studentResponses2, ...studentResponses4], 2);
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

function generateStudentData(responses: any[], submitCounter: number): any {
  return {
    responses: responses,
    submitCounter: submitCounter
  };
}

function generateStudentResponse(text: string): any {
  return { text: text, user: 'Student' };
}

function generateComputerResponse(text: string, ideas: any, scores: any): any {
  return {
    text: text,
    user: 'Computer',
    ideas: generateIdeas(ideas),
    scores: generateScores(scores)
  };
}

function generateIdeas(ideaMappings: any): any[] {
  return Object.entries(ideaMappings).map(([name, detected]) => ({ name, detected }));
}

function generateScores(scoreMappings: any): any[] {
  return Object.entries(scoreMappings).map(([id, score]) => ({ id, score }));
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
