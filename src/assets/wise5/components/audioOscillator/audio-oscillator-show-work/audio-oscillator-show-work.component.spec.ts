import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../../common/ComponentContent';
import { ProjectService } from '../../../services/projectService';
import { AudioOscillatorStudentData } from '../AudioOscillatorStudentData';
import { AudioOscillatorShowWorkComponent } from './audio-oscillator-show-work.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: AudioOscillatorShowWorkComponent;
let fixture: ComponentFixture<AudioOscillatorShowWorkComponent>;

describe('AudioOscillatorShowWorkComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [AudioOscillatorShowWorkComponent],
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(AudioOscillatorShowWorkComponent);
    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({} as ComponentContent);
    component = fixture.componentInstance;
    const audioOscillatorStudentData = {
      amplitudesPlayed: null,
      amplitudesPlayedSorted: null,
      numberOfAmplitudesPlayed: null,
      numberOfUniqueAmplitudesPlayed: null,
      minAmplitudePlayed: null,
      maxAmplitudePlayed: null,
      frequenciesPlayed: [],
      frequenciesPlayedSorted: [],
      numberOfFrequenciesPlayed: 0,
      numberOfUniqueFrequenciesPlayed: 0,
      minFrequencyPlayed: null,
      maxFrequencyPlayed: null,
      submitCounter: 0
    };
    component.componentState = createComponentStateObject(audioOscillatorStudentData);
    fixture.detectChanges();
  });

  initializeFrequencies();
  initializeAmplitudes();
});

function createComponentStateObject(audioOscillatorStudentData: AudioOscillatorStudentData): any {
  return {
    studentData: audioOscillatorStudentData
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
    const studentData = {
      amplitudesPlayed: null,
      amplitudesPlayedSorted: null,
      numberOfAmplitudesPlayed: null,
      numberOfUniqueAmplitudesPlayed: null,
      minAmplitudePlayed: null,
      maxAmplitudePlayed: null,
      frequenciesPlayed: frequenciesPlayed,
      frequenciesPlayedSorted: frequenciesPlayedSorted,
      numberOfFrequenciesPlayed: numberOfFrequenciesPlayed,
      numberOfUniqueFrequenciesPlayed: numberOfUniqueFrequenciesPlayed,
      minFrequencyPlayed: minFrequencyPlayed,
      maxFrequencyPlayed: maxFrequencyPlayed,
      submitCounter: 0
    };
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
    const studentData = {
      amplitudesPlayed: amplitudesPlayed,
      amplitudesPlayedSorted: amplitudesPlayedSorted,
      numberOfAmplitudesPlayed: numberOfAmplitudesPlayed,
      numberOfUniqueAmplitudesPlayed: numberOfUniqueAmplitudesPlayed,
      minAmplitudePlayed: minAmplitudePlayed,
      maxAmplitudePlayed: maxAmplitudePlayed,
      frequenciesPlayed: null,
      frequenciesPlayedSorted: null,
      numberOfFrequenciesPlayed: null,
      numberOfUniqueFrequenciesPlayed: null,
      minFrequencyPlayed: null,
      maxFrequencyPlayed: null,
      submitCounter: 0
    };
    component.initializeAmplitudes(studentData);
    expect(component.amplitudesPlayed).toEqual(amplitudesPlayed.join(', '));
    expect(component.amplitudesPlayedSorted).toEqual(amplitudesPlayedSorted.join(', '));
    expect(component.numberOfAmplitudesPlayed).toEqual(numberOfAmplitudesPlayed);
    expect(component.numberOfUniqueAmplitudesPlayed).toEqual(numberOfUniqueAmplitudesPlayed);
    expect(component.minAmplitudePlayed).toEqual(minAmplitudePlayed);
    expect(component.maxAmplitudePlayed).toEqual(maxAmplitudePlayed);
  });
}
