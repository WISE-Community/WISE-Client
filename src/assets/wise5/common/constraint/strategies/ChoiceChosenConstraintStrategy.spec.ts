import { TestBed } from '@angular/core/testing';
import { StudentDataService } from '../../../services/studentDataService';
import { ChoiceChosenConstraintStrategy } from './ChoiceChosenConstraintStrategy';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ComponentServiceLookupServiceModule } from '../../../services/componentServiceLookupServiceModule';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';

const choiceId1 = 'choice1';
const choiceId2 = 'choice2';
const choiceId3 = 'choice3';
let componentServiceLookupService: ComponentServiceLookupService;
let dataService: StudentDataService;
let getLatestComponentStateSpy: jasmine.Spy;
let strategy: ChoiceChosenConstraintStrategy;

const choice1 = { id: choiceId1 };
const choice2 = { id: choiceId2 };
const choice3 = { id: choiceId3 };
const criteria = {
  params: {
    nodeId: 'node1',
    componentId: 'component1',
    choiceIds: choiceId1
  }
};

describe('ChoiceChosenConstraintStrategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ComponentServiceLookupServiceModule,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ]
    });
    strategy = new ChoiceChosenConstraintStrategy();
    componentServiceLookupService = TestBed.inject(ComponentServiceLookupService);
    strategy.componentServiceLookupService = componentServiceLookupService;
    dataService = TestBed.inject(StudentDataService);
    strategy.dataService = dataService;
    getLatestComponentStateSpy = spyOn(
      dataService,
      'getLatestComponentStateByNodeIdAndComponentId'
    );
  });
  evaluate();
});

function evaluate(): void {
  describe('evaluate()', () => {
    noChoicesChosen();
    oneChoiceChosen();
    multipleChoicesChosen();
  });
}

function noChoicesChosen(): void {
  describe('no choices are chosen', () => {
    it('returns false', () => {
      setStudentChoicesEvaluateAndExpect([], false);
    });
  });
}

function oneChoiceChosen(): void {
  describe('one choice is chosen', () => {
    describe('the expected choice is not chosen', () => {
      it('returns false', () => {
        setStudentChoicesEvaluateAndExpect([choice2], false);
      });
    });
    describe('the expected choice is chosen', () => {
      it('returns true', () => {
        setStudentChoicesEvaluateAndExpect([choice1], true);
      });
    });
  });
}

function multipleChoicesChosen(): void {
  describe('multiple choices are chosen', () => {
    describe('the expected choice is not chosen', () => {
      it('returns false', () => {
        setStudentChoicesEvaluateAndExpect([choice2, choice3], false);
      });
    });
    describe('the expected choice is chosen', () => {
      it('returns true', () => {
        setStudentChoicesEvaluateAndExpect([choice1, choice2], true);
      });
    });
  });
}

function setStudentChoicesEvaluateAndExpect(studentChoices: any[], expectedValue: boolean): void {
  setStudentChoices(studentChoices);
  expect(strategy.evaluate(criteria)).toEqual(expectedValue);
}

function setStudentChoices(studentChoices: any[]): void {
  const componentState = {
    studentData: {
      studentChoices: studentChoices
    }
  };
  getLatestComponentStateSpy.and.returnValue(componentState);
}
