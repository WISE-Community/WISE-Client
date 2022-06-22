import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentServiceLookupServiceModule } from '../../../services/componentServiceLookupServiceModule';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { ComponentService } from '../../componentService';
import { SummaryStudent } from './summary-student.component';

class MockNodeService {
  createNewComponentState() {
    return {};
  }
}

let component: SummaryStudent;
const componentId = 'component1';
let fixture: ComponentFixture<SummaryStudent>;
const nodeId = 'node1';
const otherStepTitle = 'Choose your favorite ice cream';

describe('SummaryStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        ComponentServiceLookupServiceModule,
        HttpClientTestingModule,
        MatDialogModule,
        NoopAnimationsModule,
        UpgradeModule
      ],
      declarations: [SummaryStudent],
      providers: [
        AnnotationService,
        ComponentService,
        ConfigService,
        { provide: NodeService, useClass: MockNodeService },
        NotebookService,
        NotificationService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(SummaryStudent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    component.componentContent = {
      id: componentId,
      prompt: 'View the the graph of the choices your classmates chose.',
      showSaveButton: true,
      showSubmitButton: true
    };
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'registerNotebookItemChosenListener').and.callFake(() => {});
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  calculateIsShowDisplay();
  getOtherPrompt();
  getWarningMessageForSourceSelf();
  getWarningMessageForSourceClass();
  isStudentHasWork();
  setPeriodIfNecessary();
  studentHasSubmittedWork();
  studentHasSavedWork();
});

function calculateIsShowDisplay() {
  describe('calculateIsShowDisplay', () => {
    it('should calculate is show display when submit is required and there is no submit', () => {
      spyOn(component, 'isRequirementToSeeSummarySubmitWork').and.returnValue(true);
      spyOn(component, 'studentHasSubmittedWork').and.returnValue(false);
      expect(component.calculateIsShowDisplay()).toEqual(false);
    });
    it('should calculate is show display when submit is required and there is a submit', () => {
      spyOn(component, 'isRequirementToSeeSummarySubmitWork').and.returnValue(true);
      spyOn(component, 'studentHasSubmittedWork').and.returnValue(true);
      expect(component.calculateIsShowDisplay()).toEqual(true);
    });
    it(`should calculate is show display when completion is required and student did not complete
        the component`, () => {
      spyOn(component, 'isRequirementToSeeSummaryCompleteComponent').and.returnValue(true);
      spyOn(component, 'studentHasCompletedComponent').and.returnValue(false);
      expect(component.calculateIsShowDisplay()).toEqual(false);
    });
    it(`should calculate is show display when completion is required and student did complete the
        component`, () => {
      spyOn(component, 'isRequirementToSeeSummaryCompleteComponent').and.returnValue(true);
      spyOn(component, 'studentHasCompletedComponent').and.returnValue(true);
      expect(component.calculateIsShowDisplay()).toEqual(true);
    });
    it('should calculate is show display when there is no requirement', () => {
      spyOn(component, 'isRequirementToSeeSummaryNone').and.returnValue(true);
      expect(component.calculateIsShowDisplay()).toEqual(true);
    });
  });
}

function getOtherPrompt() {
  describe('getOtherPrompt', () => {
    it('should get other prompt', () => {
      const prompt = 'Choose your favorite ice cream flavor.';
      spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue({
        prompt: prompt
      });
      expect(component.getOtherPrompt('node2', 'component2')).toEqual(prompt);
    });
  });
}

function isStudentHasWork() {
  describe('isStudentHasWork', () => {
    it('should check if student has work when student does not have work', () => {
      spyOn(
        TestBed.inject(StudentDataService),
        'getComponentStatesByNodeIdAndComponentId'
      ).and.returnValue([]);
      expect(component.isStudentHasWork()).toEqual(false);
    });
    it('should check if student has work when student has work', () => {
      spyOn(
        TestBed.inject(StudentDataService),
        'getComponentStatesByNodeIdAndComponentId'
      ).and.returnValue([{}]);
      expect(component.isStudentHasWork()).toEqual(true);
    });
  });
}

function studentHasSubmittedWork() {
  describe('studentHasSubmittedWork', () => {
    it('should check if student has submitted work when they have no work', () => {
      expectStudentHasSubmittedWork([], false);
    });
    it('should check if student has submitted work when they have not submitted work', () => {
      expectStudentHasSubmittedWork([{ isSubmit: false }], false);
    });
    it('should check if student has submitted work when they have submitted work', () => {
      expectStudentHasSubmittedWork([{ isSubmit: false }, { isSubmit: true }], true);
    });
  });
}

function expectStudentHasSubmittedWork(componentStates: any[], expectedResult: boolean) {
  spyOn(
    TestBed.inject(StudentDataService),
    'getComponentStatesByNodeIdAndComponentId'
  ).and.returnValue(componentStates);
  expect(component.studentHasSubmittedWork()).toEqual(expectedResult);
}

function studentHasSavedWork() {
  describe('studentHasSavedWork', () => {
    it('should check if student has saved work when they have no work', () => {
      const componentStates = [];
      spyOn(
        TestBed.inject(StudentDataService),
        'getComponentStatesByNodeIdAndComponentId'
      ).and.returnValue(componentStates);
      expect(component.studentHasSavedWork()).toEqual(false);
    });
    it('should check if student has saved work when they have work', () => {
      const componentStates = [{}];
      spyOn(
        TestBed.inject(StudentDataService),
        'getComponentStatesByNodeIdAndComponentId'
      ).and.returnValue(componentStates);
      expect(component.studentHasSavedWork()).toEqual(true);
    });
  });
}

function getWarningMessageForSourceSelf() {
  describe('getWarningMessageForSourceSelf', () => {
    it('should get warning message when the source of the graph data is the student', () => {
      expectGetWarningMessageForSourceSelf(
        true,
        false,
        `You must submit work on "${otherStepTitle}" to view the summary.`
      );
    });
    it('should get warning message when the source of the graph data is the student', () => {
      expectGetWarningMessageForSourceSelf(
        false,
        true,
        `You must complete "${otherStepTitle}" to view the summary.`
      );
    });
  });
}

function expectGetWarningMessageForSourceSelf(
  isRequirementToSeeSummarySubmitWork: boolean,
  isRequirementToSeeSummaryCompleteComponent: boolean,
  expectedMessage: string
) {
  expectGetWarningMessage(
    'getWarningMessageForSourceSelf',
    isRequirementToSeeSummarySubmitWork,
    isRequirementToSeeSummaryCompleteComponent,
    expectedMessage
  );
}

function getWarningMessageForSourceClass() {
  describe('getWarningMessageForSourceClass', () => {
    it('should get warning message when the source of the graph data is the class', () => {
      expectGetWarningMessageForSourceClass(
        true,
        false,
        `You must submit work on "${otherStepTitle}" to view the class summary.`
      );
    });
    it('should get warning message when the source of the graph data is the class', () => {
      expectGetWarningMessageForSourceClass(
        false,
        true,
        `You must complete "${otherStepTitle}" to view the class summary.`
      );
    });
  });
}

function expectGetWarningMessageForSourceClass(
  isRequirementToSeeSummarySubmitWork: boolean,
  isRequirementToSeeSummaryCompleteComponent: boolean,
  expectedMessage: string
) {
  expectGetWarningMessage(
    'getWarningMessageForSourceClass',
    isRequirementToSeeSummarySubmitWork,
    isRequirementToSeeSummaryCompleteComponent,
    expectedMessage
  );
}

function expectGetWarningMessage(
  functionName: string,
  isRequirementToSeeSummarySubmitWork: boolean,
  isRequirementToSeeSummaryCompleteComponent: boolean,
  expectedMessage: string
) {
  component.otherStepTitle = otherStepTitle;
  spyOn(component, 'isRequirementToSeeSummarySubmitWork').and.returnValue(
    isRequirementToSeeSummarySubmitWork
  );
  spyOn(component, 'isRequirementToSeeSummaryCompleteComponent').and.returnValue(
    isRequirementToSeeSummaryCompleteComponent
  );
  expect(component[functionName]()).toEqual(expectedMessage);
}

function setPeriodIfNecessary() {
  describe('setPeriodIfNecessary', () => {
    it('should set period when the source is period', () => {
      spyOn(TestBed.inject(ConfigService), 'isStudentRun').and.returnValue(true);
      const periodId = 10;
      spyOn(TestBed.inject(ConfigService), 'getPeriodId').and.returnValue(periodId);
      component.source = 'period';
      component.setPeriodIdIfNecessary();
      expect(component.periodId).toEqual(periodId);
    });
    it('should set period when the source is all periods', () => {
      spyOn(TestBed.inject(ConfigService), 'isStudentRun').and.returnValue(true);
      component.source = 'allPeriods';
      component.setPeriodIdIfNecessary();
      expect(component.periodId).toEqual(null);
    });
  });
}
