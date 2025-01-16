import { MatchService } from '../../assets/wise5/components/match/matchService';
import { TestBed } from '@angular/core/testing';

let service: MatchService;
let componentStateBucketWithItem: any;
describe('MatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatchService]
    });
    service = TestBed.inject(MatchService);
    componentStateBucketWithItem = createComponentStateBucket('bucket1', 'Bucket 1', [
      {
        id: 'choice1',
        value: 'Choice 1',
        type: 'choice'
      }
    ]);
  });
  createComponent();
  isCompleted();
  componentStateHasStudentWork();
  componentHasCorrectAnswer();
});

function createMatchComponent(choices: any[], buckets: any[], feedback: any[]) {
  return {
    choices: choices,
    buckets: buckets,
    feedback: feedback
  };
}

function createComponentState(buckets: any[], isSubmit: boolean = false) {
  return {
    studentData: {
      buckets: buckets
    },
    isSubmit: isSubmit
  };
}

function createComponentStateBucket(id: string, value: string, items: any[]) {
  const bucket: any = {
    id: id,
    value: value,
    type: 'bucket'
  };
  bucket.items = items;
  return bucket;
}

function createFeedbackForBucket(bucketId: string, choices: any[]) {
  return {
    bucketId: bucketId,
    choices: choices
  };
}

function createFeedbackForChoice(choiceId: string, feedback: string, isCorrect: boolean = false) {
  return {
    choiceId: choiceId,
    feedback: feedback,
    isCorrect: isCorrect,
    position: null,
    incorrectPositionFeedback: null
  };
}

function createComponent() {
  it('should create a component', () => {
    const component = service.createComponent();
    expect(component.type).toEqual('Match');
    expect(component.choices).toEqual([]);
    expect(component.buckets).toEqual([]);
    expect(component.feedback).toEqual([{ bucketId: '0', choices: [] }]);
    expect(component.ordered).toEqual(false);
  });
}

function isCompleted() {
  let component: any;
  let componentStates: any[];
  let node: any;
  beforeEach(() => {
    component = {};
    componentStates = [];
    node = {};
  });
  function expectIsCompleted(
    component: any,
    componentStates: any[],
    node: any,
    expectedResult: boolean
  ) {
    expect(service.isCompleted(component, componentStates, [], node)).toEqual(expectedResult);
  }
  it(`should check if is completed when submit is not required and there are no component states`, () => {
    expectIsCompleted(component, componentStates, node, false);
  });
  it(`should check if is completed when submit is not required and there are component states`, () => {
    componentStates.push(createComponentState([componentStateBucketWithItem]));
    expectIsCompleted(component, componentStates, node, true);
  });
  it(`should check if is completed when submit is required and there are no component states`, () => {
    node.showSubmitButton = true;
    expectIsCompleted(component, componentStates, node, false);
  });
  it(`should check if is completed when when submit is required and there are component states but
      none with submit`, () => {
    node.showSubmitButton = true;
    componentStates.push(createComponentState([componentStateBucketWithItem]));
    expectIsCompleted(component, componentStates, node, false);
  });
  it(`should check if is completed when when submit is required and there are component states with
      submit`, () => {
    node.showSubmitButton = true;
    componentStates.push(createComponentState([componentStateBucketWithItem], true));
    expectIsCompleted(component, componentStates, node, true);
  });
}

function componentStateHasStudentWork() {
  let componentState: any;
  beforeEach(() => {
    componentState = createComponentState([]);
  });
  function expectComponentStateHasStudentWork(componentState: any, expectedResult: boolean) {
    expect(service.componentStateHasStudentWork(componentState, {})).toEqual(expectedResult);
  }
  it('should check if a component state has student work when it does not have work', () => {
    expectComponentStateHasStudentWork(componentState, false);
  });
  it('should check if a component state has student work when it does have work', () => {
    componentState.studentData.buckets.push(componentStateBucketWithItem);
    expectComponentStateHasStudentWork(componentState, true);
  });
}

function componentHasCorrectAnswer() {
  let component: any;
  beforeEach(() => {
    const choices = [
      createFeedbackForChoice('choice1', 'Choice 1', false),
      createFeedbackForChoice('choice2', 'Choice 2', false)
    ];
    const feedback = [createFeedbackForBucket('bucket1', choices)];
    component = createMatchComponent([], [], feedback);
  });
  function expectHasCorrectAnswer(component: any, expectedResult: boolean) {
    expect(service.componentHasCorrectAnswer(component)).toEqual(expectedResult);
  }
  it('should check if there is a correct answer when there is none', () => {
    expectHasCorrectAnswer(component, false);
  });
  it('should check if there is a correct answer when there is one', () => {
    component.feedback[0].choices[1].isCorrect = true;
    expectHasCorrectAnswer(component, true);
  });
}
