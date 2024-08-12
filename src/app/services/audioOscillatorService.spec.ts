import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AudioOscillatorService } from '../../assets/wise5/components/audioOscillator/audioOscillatorService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: AudioOscillatorService;

describe('AudioOscillatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.get(AudioOscillatorService);
  });
  createComponent();
  isCompleted();
  componentHasStudentWork();
});

function createComponentState(frequenciesPlayed: number[]) {
  return {
    studentData: {
      frequenciesPlayed: frequenciesPlayed
    }
  };
}

function createComponent() {
  it('should create an audio oscillator component', () => {
    const component: any = service.createComponent();
    expect(component.type).toEqual('AudioOscillator');
    expect(component.oscillatorTypes).toEqual(['sine']);
    expect(component.startingFrequency).toEqual(440);
    expect(component.oscilloscopeWidth).toEqual(800);
    expect(component.oscilloscopeHeight).toEqual(400);
    expect(component.gridCellSize).toEqual(50);
    expect(component.stopAfterGoodDraw).toEqual(true);
  });
}

function isCompleted() {
  function expectIsCompleted(componentStates: any, expectedResult: boolean) {
    expect(service.isCompleted({}, componentStates, [], {})).toEqual(expectedResult);
  }
  it('should check is completed when it is not completed', () => {
    expectIsCompleted([], false);
  });
  it('should check is completed when it is completed', () => {
    expectIsCompleted([createComponentState([440])], true);
  });
}

function componentHasStudentWork() {
  function expectComponentHasStudentWork(componentState: any, expectedResult: boolean) {
    expect(service.componentStateHasStudentWork(componentState, {})).toEqual(expectedResult);
  }
  it('should check if a component state has student work when it does not have student work', () => {
    expectComponentHasStudentWork(createComponentState([]), false);
  });
  it('should check if a component state has student work when it does have student work', () => {
    expectComponentHasStudentWork(createComponentState([440]), true);
  });
}
