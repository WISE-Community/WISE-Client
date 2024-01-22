import { ComponentState } from '../../../../../app/domain/componentState';
import { ExportStrategyTester } from './ExportStrategyTester';
import { MatchComponentDataExportStrategy } from './MatchComponentDataExportStrategy';

const additionalColumns = [
  'Choice A',
  'Choice B',
  'Choice C',
  'Choice D',
  'Choice A Correctness',
  'Choice B Correctness',
  'Choice C Correctness',
  'Choice D Correctness',
  'Is Correct'
];
const bucketId0 = '0';
const bucketId1 = 'bucket1';
const bucketId2 = 'bucket2';
const bucketId3 = 'bucket3';
const bucketValue0 = 'Choices';
const bucketValue1 = 'Bucket A';
const bucketValue2 = 'Bucket B';
const bucketValue3 = 'Bucket C';
const choiceId1 = 'choice1';
const choiceId2 = 'choice2';
const choiceId3 = 'choice3';
const choiceId4 = 'choice4';
const choiceValue1 = 'Choice A';
const choiceValue2 = 'Choice B';
const choiceValue3 = 'Choice C';
const choiceValue4 = 'Choice D';
let componentState1: any;
let componentState2: any;
let componentState3: any;
let componentState4: any;
const componentType = 'Match';
let exportStrategyTester: ExportStrategyTester = new ExportStrategyTester();
let studentData1: any;
let studentData2: any;
let studentData3: any;
let studentData4: any;

describe('MatchComponentDataExportStrategy', () => {
  beforeEach(() => {
    exportStrategyTester = new ExportStrategyTester();
    exportStrategyTester.setUpServices();
    initializeStudentWork();
  });
  exportAllRevisions();
  exportLatestRevisions();
  exportMatchComponentWithChoiceReuse();
  exportMatchComponentWithCorrectPosition();
});

function exportAllRevisions(): void {
  describe('export all revisions', () => {
    it('exports all revisions', () => {
      setUpComponent();
      exportStrategyTester.setStudentData([
        componentState1,
        componentState2,
        componentState3,
        componentState4
      ]);
      setUpExportStrategy('all');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd(
        additionalColumns
      );
      expect(
        exportStrategyTester.componentExportStrategy.controller.generateCSVFile
      ).toHaveBeenCalledWith(
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
            'Bucket A',
            'Choices',
            'Choices',
            'Choices',
            '',
            '',
            '',
            '',
            0
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
            'Bucket A',
            'Bucket A',
            'Bucket B',
            'Bucket B',
            1,
            0,
            0,
            0,
            0
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
            'Bucket A',
            'Bucket A',
            'Bucket A',
            'Bucket A',
            1,
            0,
            0,
            0,
            0
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
            'Bucket A',
            'Bucket B',
            'Bucket C',
            'Choices',
            1,
            1,
            1,
            1,
            1
          ]
        ],
        exportStrategyTester.createExpectedFileName('match')
      );
    });
  });
}

function exportLatestRevisions(): void {
  describe('export latest revisions', () => {
    it('exports latest revisions', () => {
      setUpComponent();
      exportStrategyTester.setStudentData([
        componentState1,
        componentState2,
        componentState3,
        componentState4
      ]);
      setUpExportStrategy('latest');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd(
        additionalColumns
      );
      expect(
        exportStrategyTester.componentExportStrategy.controller.generateCSVFile
      ).toHaveBeenCalledWith(
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
            'Bucket A',
            'Bucket A',
            'Bucket B',
            'Bucket B',
            1,
            0,
            0,
            0,
            0
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
            'Bucket A',
            'Bucket B',
            'Bucket C',
            'Choices',
            1,
            1,
            1,
            1,
            1
          ]
        ],
        exportStrategyTester.createExpectedFileName('match')
      );
    });
  });
}

function exportMatchComponentWithChoiceReuse(): void {
  describe('component allows choice reuse', () => {
    it('exports with choice reuse data', () => {
      initializeChoiceReuseStudentWork();
      setUpComponent();
      exportStrategyTester.component.choiceReuseEnabled = true;
      exportStrategyTester.setStudentData([componentState1]);
      setUpExportStrategy('all');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd(
        additionalColumns
      );
      expect(
        exportStrategyTester.componentExportStrategy.controller.generateCSVFile
      ).toHaveBeenCalledWith(
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
            'Choices, Bucket A, Bucket B',
            'Choices',
            'Choices',
            'Choices',
            '',
            '',
            '',
            '',
            0
          ]
        ],
        exportStrategyTester.createExpectedFileName('match')
      );
    });
  });
}

function exportMatchComponentWithCorrectPosition(): void {
  describe('component with correct position', () => {
    it('exports with correct position data', () => {
      initializeCorrectPositionStudentWork();
      setUpComponent();
      exportStrategyTester.component.ordered = true;
      exportStrategyTester.setStudentData([componentState1]);
      setUpExportStrategy('all');
      exportStrategyTester.componentExportStrategy.export();
      const headerRow = exportStrategyTester.createHeaderRowAddAdditionalColumnsAtEnd(
        additionalColumns
      );
      expect(
        exportStrategyTester.componentExportStrategy.controller.generateCSVFile
      ).toHaveBeenCalledWith(
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
            'Bucket A',
            'Bucket A',
            'Choices',
            'Choices',
            2,
            2,
            '',
            '',
            0
          ]
        ],
        exportStrategyTester.createExpectedFileName('match')
      );
    });
  });
}

function setUpComponent(): void {
  exportStrategyTester.setComponent({
    id: exportStrategyTester.componentId,
    type: componentType,
    prompt: exportStrategyTester.componentPrompt,
    choices: [
      {
        id: choiceId1,
        value: choiceValue1
      },
      {
        id: choiceId2,
        value: choiceValue2
      },
      {
        id: choiceId3,
        value: choiceValue3
      },
      {
        id: choiceId4,
        value: choiceValue4
      }
    ],
    choiceReuseEnabled: false,
    buckets: [
      {
        id: bucketId1,
        value: bucketValue1,
        type: 'bucket'
      },
      {
        id: bucketId2,
        value: bucketValue2,
        type: 'bucket'
      },
      {
        id: bucketId3,
        value: bucketValue3,
        type: 'bucket'
      }
    ],
    feedback: [
      {
        bucketId: '0',
        choices: [
          {
            choiceId: choiceId1,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId2,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId3,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId4,
            feedback: '',
            isCorrect: true,
            position: null,
            incorrectPositionFeedback: null
          }
        ]
      },
      {
        bucketId: bucketId1,
        choices: [
          {
            choiceId: choiceId1,
            feedback: '',
            isCorrect: true,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId2,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId3,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId4,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          }
        ]
      },
      {
        bucketId: bucketId2,
        choices: [
          {
            choiceId: choiceId1,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId2,
            feedback: '',
            isCorrect: true,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId3,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId4,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          }
        ]
      },
      {
        bucketId: bucketId3,
        choices: [
          {
            choiceId: choiceId1,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId2,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId3,
            feedback: '',
            isCorrect: true,
            position: null,
            incorrectPositionFeedback: null
          },
          {
            choiceId: choiceId4,
            feedback: '',
            isCorrect: false,
            position: null,
            incorrectPositionFeedback: null
          }
        ]
      }
    ],
    ordered: false
  });
}

function setUpExportStrategy(
  allOrLatest: 'all' | 'latest',
  includeOnlySubmits: boolean = false
): void {
  exportStrategyTester.setUpExportStrategy(
    new MatchComponentDataExportStrategy(
      exportStrategyTester.nodeId,
      exportStrategyTester.component,
      exportStrategyTester.createComponentDataExportParams(true, includeOnlySubmits, true),
      allOrLatest
    )
  );
}

function initializeStudentWork(): void {
  studentData1 = {
    buckets: [
      createStudentDataBucketX(0, [
        createStudentDataChoiceX(2, null),
        createStudentDataChoiceX(3, null),
        createStudentDataChoiceX(4, null)
      ]),
      createStudentDataBucketX(1, [createStudentDataChoiceX(1, null)]),
      createStudentDataBucketX(2, []),
      createStudentDataBucketX(3, [])
    ],
    submitCounter: 0
  };
  studentData2 = {
    buckets: [
      createStudentDataBucketX(0, []),
      createStudentDataBucketX(1, [
        createStudentDataChoiceX(1, true),
        createStudentDataChoiceX(2, false),
        createStudentDataChoiceX(3, false),
        createStudentDataChoiceX(4, false)
      ]),
      createStudentDataBucketX(2, []),
      createStudentDataBucketX(3, [])
    ],
    isCorrect: false,
    submitCounter: 1
  };
  studentData3 = {
    buckets: [
      createStudentDataBucketX(0, []),
      createStudentDataBucketX(1, [
        createStudentDataChoiceX(1, true),
        createStudentDataChoiceX(2, false)
      ]),
      createStudentDataBucketX(2, [
        createStudentDataChoiceX(3, false),
        createStudentDataChoiceX(4, false)
      ]),
      createStudentDataBucketX(3, [])
    ],
    isCorrect: false,
    submitCounter: 1
  };
  studentData4 = {
    buckets: [
      createStudentDataBucketX(0, [createStudentDataChoiceX(4, true)]),
      createStudentDataBucketX(1, [createStudentDataChoiceX(1, true)]),
      createStudentDataBucketX(2, [createStudentDataChoiceX(2, true)]),
      createStudentDataBucketX(3, [createStudentDataChoiceX(3, true)])
    ],
    isCorrect: true,
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

function initializeChoiceReuseStudentWork(): void {
  studentData1 = {
    buckets: [
      createStudentDataBucketX(0, [
        createStudentDataChoiceX(1, null),
        createStudentDataChoiceX(2, null),
        createStudentDataChoiceX(3, null),
        createStudentDataChoiceX(4, null)
      ]),
      createStudentDataBucketX(1, [createStudentDataChoiceX(1, null)]),
      createStudentDataBucketX(2, [createStudentDataChoiceX(1, null)]),
      createStudentDataBucketX(3, [])
    ],
    submitCounter: 0
  };
  componentState1 = createComponentState(
    exportStrategyTester.studentWorkId1,
    exportStrategyTester.studentWorkTimestampMilliseconds1,
    false,
    studentData1,
    exportStrategyTester.workgroupId1
  );
}

function initializeCorrectPositionStudentWork(): void {
  studentData1 = {
    buckets: [
      createStudentDataBucketX(0, [
        createStudentDataChoiceX(3, null),
        createStudentDataChoiceX(4, null)
      ]),
      createStudentDataBucketX(1, [
        createStudentDataChoice(choiceId1, choiceValue1, '', false, true),
        createStudentDataChoice(choiceId2, choiceValue2, '', false, true)
      ]),
      createStudentDataBucketX(2, []),
      createStudentDataBucketX(3, [])
    ],
    submitCounter: 1
  };
  componentState1 = createComponentState(
    exportStrategyTester.studentWorkId1,
    exportStrategyTester.studentWorkTimestampMilliseconds1,
    true,
    studentData1,
    exportStrategyTester.workgroupId1
  );
}

function createStudentDataBucketX(bucketNum: number, items: any[]): any {
  switch (bucketNum) {
    case 0:
      return createStudentDataBucket(bucketId0, bucketValue0, items);
    case 1:
      return createStudentDataBucket(bucketId1, bucketValue1, items);
    case 2:
      return createStudentDataBucket(bucketId2, bucketValue2, items);
    case 3:
      return createStudentDataBucket(bucketId3, bucketValue3, items);
  }
}

function createStudentDataBucket(id: string, value: string, items: any[]): any {
  return {
    id,
    value,
    items,
    type: 'bucket'
  };
}

function createStudentDataChoiceX(choiceNum: number, isCorrect: boolean): any {
  switch (choiceNum) {
    case 1:
      return createStudentDataChoice(choiceId1, choiceValue1, '', isCorrect, null);
    case 2:
      return createStudentDataChoice(choiceId2, choiceValue2, '', isCorrect, null);
    case 3:
      return createStudentDataChoice(choiceId3, choiceValue3, '', isCorrect, null);
    case 4:
      return createStudentDataChoice(choiceId4, choiceValue4, '', isCorrect, null);
  }
}

function createStudentDataChoice(
  id: string,
  value: string,
  feedback: string,
  isCorrect: boolean,
  isIncorrectPosition: boolean
): any {
  return {
    id,
    value,
    feedback,
    isCorrect,
    isIncorrectPosition
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
