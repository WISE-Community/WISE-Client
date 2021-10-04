import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { UtilService } from '../../../services/utilService';
import { AudioOscillatorGrading } from './audio-oscillator-grading.component';

let component: AudioOscillatorGrading;
let fixture: ComponentFixture<AudioOscillatorGrading>;

describe('AudioOscillatorGrading', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [AudioOscillatorGrading],
      providers: [ConfigService, SessionService, ProjectService, UtilService],
      schemas: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioOscillatorGrading);
    spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue({});
    component = fixture.componentInstance;
    component.componentState = createComponentStateObject(
      null,
      null,
      [],
      [],
      0,
      0,
      0,
      0,
      null,
      null,
      null,
      null
    );
    fixture.detectChanges();
  });

  initializeFrequencies();
  initializeAmplitudes();
});

function createComponentStateObject(
  amplitudesPlayed: number[],
  amplitudesPlayedSorted: number[],
  frequenciesPlayed: number[],
  frequenciesPlayedSorted: number[],
  numberOfAmplitudesPlayed: number,
  numberOfUniqueAmplitudesPlayed: number,
  numberOfFrequenciesPlayed: number,
  numberOfUniqueFrequenciesPlayed: number,
  minAmplitudePlayed: number,
  maxAmplitudePlayed: number,
  minFrequencyPlayed: number,
  maxFrequencyPlayed: number
) {
  return {
    studentData: createStudentDataObject(
      amplitudesPlayed,
      amplitudesPlayedSorted,
      frequenciesPlayed,
      frequenciesPlayedSorted,
      numberOfAmplitudesPlayed,
      numberOfUniqueAmplitudesPlayed,
      numberOfFrequenciesPlayed,
      numberOfUniqueFrequenciesPlayed,
      minAmplitudePlayed,
      maxAmplitudePlayed,
      minFrequencyPlayed,
      maxFrequencyPlayed
    )
  };
}

function createStudentDataObject(
  amplitudesPlayed: number[],
  amplitudesPlayedSorted: number[],
  frequenciesPlayed: number[],
  frequenciesPlayedSorted: number[],
  numberOfAmplitudesPlayed: number,
  numberOfUniqueAmplitudesPlayed: number,
  numberOfFrequenciesPlayed: number,
  numberOfUniqueFrequenciesPlayed: number,
  minAmplitudePlayed: number,
  maxAmplitudePlayed: number,
  minFrequencyPlayed: number,
  maxFrequencyPlayed: number
) {
  return {
    amplitudesPlayed: amplitudesPlayed,
    amplitudesPlayedSorted: amplitudesPlayedSorted,
    frequenciesPlayed: frequenciesPlayed,
    frequenciesPlayedSorted: frequenciesPlayedSorted,
    numberOfAmplitudesPlayed: numberOfAmplitudesPlayed,
    numberOfUniqueAmplitudesPlayed: numberOfUniqueAmplitudesPlayed,
    numberOfFrequenciesPlayed: numberOfFrequenciesPlayed,
    numberOfUniqueFrequenciesPlayed: numberOfUniqueFrequenciesPlayed,
    minAmplitudePlayed: minAmplitudePlayed,
    maxAmplitudePlayed: maxAmplitudePlayed,
    minFrequencyPlayed: minFrequencyPlayed,
    maxFrequencyPlayed: maxFrequencyPlayed
  };
}

function initializeFrequencies() {
  it('should initialize frequency data from student data', () => {
    const frequenciesPlayed = [800, 400];
    const frequenciesPlayedSorted = [400, 800];
    const numberOfFrequenciesPlayed = 2;
    const numberOfUniqueFrequenciesPlayed = 2;
    const minFrequencyPlayed = 400;
    const maxFrequencyPlayed = 800;
    const studentData = createStudentDataObject(
      null,
      null,
      frequenciesPlayed,
      frequenciesPlayedSorted,
      null,
      null,
      numberOfFrequenciesPlayed,
      numberOfUniqueFrequenciesPlayed,
      null,
      null,
      minFrequencyPlayed,
      maxFrequencyPlayed
    );
    component.initializeFrequencies(studentData);
    expect(component.frequenciesPlayed).toEqual(frequenciesPlayed.join(', '));
    expect(component.frequenciesPlayedSorted).toEqual(frequenciesPlayedSorted.join(', '));
    expect(component.numberOfFrequenciesPlayed).toEqual(numberOfFrequenciesPlayed);
    expect(component.numberOfUniqueFrequenciesPlayed).toEqual(numberOfUniqueFrequenciesPlayed);
    expect(component.minFrequencyPlayed).toEqual(minFrequencyPlayed);
    expect(component.maxFrequencyPlayed).toEqual(maxFrequencyPlayed);
  });
}

function initializeAmplitudes() {
  it('should handle when there is no amplitude data in the student data', () => {
    const studentData = {};
    component.initializeAmplitudes(studentData);
    expect(component);
  });
  it('should initialize amplitude data from student data', () => {
    const amplitudesPlayed = [50, 40];
    const amplitudesPlayedSorted = [40, 50];
    const numberOfAmplitudesPlayed = 2;
    const numberOfUniqueAmplitudesPlayed = 2;
    const minAmplitudePlayed = 40;
    const maxAmplitudePlayed = 50;
    const studentData = createStudentDataObject(
      amplitudesPlayed,
      amplitudesPlayedSorted,
      null,
      null,
      numberOfAmplitudesPlayed,
      numberOfUniqueAmplitudesPlayed,
      null,
      null,
      minAmplitudePlayed,
      maxAmplitudePlayed,
      null,
      null
    );
    component.initializeAmplitudes(studentData);
    expect(component.amplitudesPlayed).toEqual(amplitudesPlayed.join(', '));
    expect(component.amplitudesPlayedSorted).toEqual(amplitudesPlayedSorted.join(', '));
    expect(component.numberOfAmplitudesPlayed).toEqual(numberOfAmplitudesPlayed);
    expect(component.numberOfUniqueAmplitudesPlayed).toEqual(numberOfUniqueAmplitudesPlayed);
    expect(component.minAmplitudePlayed).toEqual(minAmplitudePlayed);
    expect(component.maxAmplitudePlayed).toEqual(maxAmplitudePlayed);
  });
}
