import { TestBed } from '@angular/core/testing';
import { SummaryService } from '../../assets/wise5/components/summary/summaryService';
import { UpgradeModule } from '@angular/upgrade/static';
import { UtilService } from '../../assets/wise5/services/utilService';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../assets/wise5/services/configService';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { TagService } from '../../assets/wise5/services/tagService';
import { SessionService } from '../../assets/wise5/services/sessionService';

const componentId = 'component1';
let http: HttpTestingController;
const nodeId = 'node1';
const periodId = 10;
const periodSource = 'period';
const runId = 1;
let service;
const summaryAllowedComponentTypes = [
  'Animation',
  'AudioOscillator',
  'ConceptMap',
  'Discussion',
  'Draw',
  'Embedded',
  'Graph',
  'Label',
  'Match',
  'MultipleChoice',
  'OpenResponse',
  'Table'
];
const summaryDisallowedComponentTypes = ['HTML', 'OutsideURL', 'Summary'];
const scoreSummaryAllowedComponentTypes = summaryAllowedComponentTypes;
const scoreSummaryDisallowedComponentTypes = summaryDisallowedComponentTypes;

describe('SummaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      providers: [
        AnnotationService,
        ConfigService,
        ProjectService,
        SessionService,
        SummaryService,
        TagService,
        UtilService
      ]
    });
    service = TestBed.get(SummaryService);
    http = TestBed.get(HttpTestingController);
    spyOn(TestBed.inject(ConfigService), 'getRunId').and.returnValue(runId);
    spyOn(TestBed.inject(ConfigService), 'getPeriodId').and.returnValue(periodId);
  });
  createComponent();
  isComponentTypeAllowed();
  isScoresSummaryAvailableForComponentType();
  isResponsesSummaryAvailableForComponentType();
  getLatestClassmateStudentWork();
  getLatestClassmateScores();
});

function createComponent() {
  it('should create a Summary component', () => {
    const component = service.createComponent();
    expect(component.type).toEqual('Summary');
    expect(component.source).toEqual('period');
    expect(component.chartType).toEqual('column');
    expect(component.requirementToSeeSummary).toEqual('submitWork');
    expect(component.highlightCorrectAnswer).toEqual(false);
    expect(component.customLabelColors).toEqual([]);
  });
}

function expectFunctionCall(funcName, componentTypes, expectedResult) {
  componentTypes.forEach((componentType) => {
    expect(service[funcName](componentType)).toEqual(expectedResult);
  });
}

function isComponentTypeAllowed() {
  it('should check if component types are allowed to be used in the summary', () => {
    expectFunctionCall('isComponentTypeAllowed', summaryAllowedComponentTypes, true);
    expectFunctionCall('isComponentTypeAllowed', summaryDisallowedComponentTypes, false);
  });
}

function isScoresSummaryAvailableForComponentType() {
  it('should check if score summary is available', () => {
    expectFunctionCall(
      'isScoresSummaryAvailableForComponentType',
      scoreSummaryAllowedComponentTypes,
      true
    );
    expectFunctionCall(
      'isScoresSummaryAvailableForComponentType',
      scoreSummaryDisallowedComponentTypes,
      false
    );
  });
}

function isResponsesSummaryAvailableForComponentType() {
  it('should check if component types can be used with response summary', () => {
    expectFunctionCall(
      'isResponsesSummaryAvailableForComponentType',
      ['MultipleChoice', 'Table'],
      true
    );
    expectFunctionCall(
      'isResponsesSummaryAvailableForComponentType',
      [
        'Animation',
        'AudioOscillator',
        'ConceptMap',
        'Discussion',
        'Draw',
        'Embedded',
        'Graph',
        'HTML',
        'Label',
        'Match',
        'OpenResponse',
        'OutsideURL',
        'Summary'
      ],
      false
    );
  });
}

function getLatestClassmateStudentWork() {
  it('should get latest classmate student work', () => {
    const expectedStudentWork = [{ id: 1 }];
    service
      .getLatestClassmateStudentWork(nodeId, componentId, periodSource)
      .subscribe((studentWork: any[]) => {
        expect(studentWork).toEqual(expectedStudentWork);
      });
    http
      .expectOne(
        `/api/classmate/summary/student-work/${runId}/${periodId}/${nodeId}/${componentId}/${periodSource}`
      )
      .flush(expectedStudentWork);
  });
}

function getLatestClassmateScores() {
  it('should get latest classmate scores', () => {
    const expectedScores = [{ id: 2 }];
    service
      .getLatestClassmateScores(nodeId, componentId, periodSource)
      .subscribe((scores: any[]) => {
        expect(scores).toEqual(expectedScores);
      });
    http
      .expectOne(
        `/api/classmate/summary/scores/${runId}/${periodId}/${nodeId}/${componentId}/${periodSource}`
      )
      .flush(expectedScores);
  });
}
