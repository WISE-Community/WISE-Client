import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { PossibleScoreComponent } from '../../../../../app/possible-score/possible-score.component';
import { ComponentHeader } from '../../../directives/component-header/component-header.component';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { ComponentService } from '../../componentService';
import { AudioOscillatorService } from '../audioOscillatorService';
import { AudioOscillatorStudent } from './audio-oscillator-student.component';

export class MockService {}

class MockNodeService {
  createNewComponentState() {
    return {};
  }
}

let component: AudioOscillatorStudent;
let fixture: ComponentFixture<AudioOscillatorStudent>;
let existingStudentData: any;
let newStudentData: any;
const amplitudesPlayed = [44, 20];
const frequenciesPlayed = [440, 880];
const componentId = 'component1';
const nodeId = 'node1';

describe('AudioOscillatorStudent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        ReactiveFormsModule,
        UpgradeModule
      ],
      declarations: [AudioOscillatorStudent, ComponentHeader, PossibleScoreComponent],
      providers: [
        AnnotationService,
        AudioOscillatorService,
        ComponentService,
        ConfigService,
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockService },
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ],
      schemas: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioOscillatorStudent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      comment: '',
      score: 1
    });
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    component.componentContent = {
      id: componentId,
      type: 'AudioOscillator',
      prompt: 'Listen to multiple frequencies.',
      oscillatorTypes: ['sine', 'square'],
      oscilloscopeWidth: 800,
      oscilloscopeHeight: 400,
      startingAmplitude: 44,
      canStudentEditAmplitude: true,
      canStudentViewAmplitudeInput: true,
      canStudentEditFrequency: true,
      canStudentViewFrequencyInput: true
    };
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    existingStudentData = {};
    newStudentData = {};
    fixture.detectChanges();
  });

  addAmplitudeDataToStudentData();
  addFrequencyDataToStudentData();
  addFrequencyPlayed();
  addAmplitudePlayed();
  callPlayWhenTheTogglePlayIsCalled();
  createComponentState();
  limitAmplitudeIfNecessary();
  mergeAmplitudesPlayed();
  mergeFrequenciesPlayed();
  repopulateStudentWork();
  setAmplitude();
  setFieldMinimum();
  setStudentWork();
  setTheParametersFromTheComponentContent();
});

function setFieldMinimum() {
  it('should set field minimum', () => {
    expect(component.oscilloscopeWidth).toEqual(800);
    component.setFieldMininum1('oscilloscopeWidth', 0);
    expect(component.oscilloscopeWidth).toEqual(1);
    component.setFieldMininum1('oscilloscopeWidth', 1);
    expect(component.oscilloscopeWidth).toEqual(1);
    component.setFieldMininum1('oscilloscopeWidth', 100);
    expect(component.oscilloscopeWidth).toEqual(100);
  });
}

function setStudentWork() {
  const frequenciesPlayed = [400, 1600, 800];
  const frequenciesPlayedSorted = [400, 800, 1600];
  const numberOfFrequenciesPlayed = 3;
  const numberOfUniqueFrequenciesPlayed = 3;
  const minFrequencyPlayed = 400;
  const maxFrequencyPlayed = 1600;
  const amplitudesPlayed = [44, 22];
  const amplitudesPlayedSorted = [22, 44];
  const numberOfAmplitudesPlayed = 2;
  const numberOfUniqueAmplitudesPlayed = 2;
  const minAmplitudePlayed = 22;
  const maxAmplitudePlayed = 44;
  const submitCounter = 0;
  describe('setStudentWork', () => {
    beforeEach(() => {
      spyOn(component, 'processLatestStudentWork').and.callFake(() => {});
    });
  });
  it('should set student work when there is no amplitude data', () => {
    const componentState = createComponentStateObject(
      frequenciesPlayed,
      frequenciesPlayedSorted,
      numberOfFrequenciesPlayed,
      numberOfUniqueFrequenciesPlayed,
      minFrequencyPlayed,
      maxFrequencyPlayed,
      null,
      null,
      null,
      null,
      null,
      null,
      submitCounter
    );
    component.setStudentWork(componentState);
    expect(component.frequency).toEqual(800);
    expect(component.frequenciesPlayed).toEqual(frequenciesPlayed);
    expect(component.submitCounter).toEqual(submitCounter);
  });
  it('should set student work when there is amplitude data', () => {
    const componentState = createComponentStateObject(
      frequenciesPlayed,
      frequenciesPlayedSorted,
      numberOfFrequenciesPlayed,
      numberOfUniqueFrequenciesPlayed,
      minFrequencyPlayed,
      maxFrequencyPlayed,
      amplitudesPlayed,
      amplitudesPlayedSorted,
      numberOfAmplitudesPlayed,
      numberOfUniqueAmplitudesPlayed,
      minAmplitudePlayed,
      maxAmplitudePlayed,
      submitCounter
    );
    component.setStudentWork(componentState);
    expect(component.frequency).toEqual(800);
    expect(component.frequenciesPlayed).toEqual(frequenciesPlayed);
    expect(component.amplitude).toEqual(22);
    expect(component.amplitudesPlayed).toEqual(amplitudesPlayed);
    expect(component.submitCounter).toEqual(submitCounter);
  });
}

function createComponentStateObject(
  frequenciesPlayed: number[],
  frequenciesPlayedSorted: number[],
  numberOfFrequenciesPlayed: number,
  numberOfUniqueFrequenciesPlayed: number,
  minFrequencyPlayed: number,
  maxFrequencyPlayed: number,
  amplitudesPlayed: number[],
  amplitudesPlayedSorted: number[],
  numberOfAmplitudesPlayed: number,
  numberOfUniqueAmplitudesPlayed: number,
  minAmplitudePlayed: number,
  maxAmplitudePlayed: number,
  submitCounter: number
) {
  return {
    studentData: {
      amplitudesPlayed: amplitudesPlayed,
      amplitudesPlayedSorted: amplitudesPlayedSorted,
      numberOfAmplitudesPlayed: numberOfAmplitudesPlayed,
      numberOfUniqueAmplitudesPlayed: numberOfUniqueAmplitudesPlayed,
      minAmplitudePlayed: minAmplitudePlayed,
      maxAmpltiduePlayed: maxAmplitudePlayed,
      frequenciesPlayed: frequenciesPlayed,
      frequenciesPlayedSorted: frequenciesPlayedSorted,
      numberOfFrequenciesPlayed: numberOfFrequenciesPlayed,
      numberOfUniqueFrequenciesPlayed: numberOfUniqueFrequenciesPlayed,
      minFrequencyPlayed: minFrequencyPlayed,
      maxFrequencyPlayed: maxFrequencyPlayed,
      submitCounter: submitCounter
    }
  };
}

function addFrequencyPlayed() {
  it('should add frequency played', () => {
    component.frequenciesPlayed = [800];
    component.addFrequencyPlayed(400);
    expect(component.frequenciesPlayed.length).toEqual(2);
    expect(component.frequenciesPlayed[0]).toEqual(800);
    expect(component.frequenciesPlayed[1]).toEqual(400);
  });
}

function addAmplitudePlayed() {
  it('should add amplitude played', () => {
    component.amplitudesPlayed = [44];
    component.addAmplitudePlayed(45);
    expect(component.amplitudesPlayed.length).toEqual(2);
    expect(component.amplitudesPlayed[0]).toEqual(44);
    expect(component.amplitudesPlayed[1]).toEqual(45);
  });
}

function limitAmplitudeIfNecessary() {
  it('should limit amplitude when the amplitude is below min allowed', () => {
    expect(component.limitAmplitudeIfNecessary(-1)).toEqual(component.minAmplitude);
  });
  it('should limit amplitude when the amplitude is above max allowed', () => {
    expect(component.limitAmplitudeIfNecessary(51)).toEqual(component.maxAmplitude);
  });
}

function setAmplitude() {
  it('should set amplitude', () => {
    const amplitude = 40;
    component.setAmplitude(amplitude);
    expect(component.amplitude).toEqual(amplitude);
  });
  it('should set amplitude to default value', () => {
    component.setAmplitude(null);
    expect(component.amplitude).toEqual(component.defaultDBSPL);
  });
}

function mergeFrequenciesPlayed() {
  it('should merge frequencies played', () => {
    existingStudentData.frequenciesPlayed = [100];
    newStudentData.frequenciesPlayed = [200];
    component.mergeFrequenciesPlayed(existingStudentData, newStudentData);
    expect(existingStudentData.frequenciesPlayed.length).toEqual(2);
    expect(existingStudentData.frequenciesPlayed[0]).toEqual(100);
    expect(existingStudentData.frequenciesPlayed[1]).toEqual(200);
  });
}

function mergeAmplitudesPlayed() {
  it('should merge amplitudes played', () => {
    existingStudentData.amplitudesPlayed = [40];
    newStudentData.amplitudesPlayed = [20];
    component.mergeAmplitudesPlayed(existingStudentData, newStudentData);
    expect(existingStudentData.amplitudesPlayed.length).toEqual(2);
    expect(existingStudentData.amplitudesPlayed[0]).toEqual(40);
    expect(existingStudentData.amplitudesPlayed[1]).toEqual(20);
  });
}

function setTheParametersFromTheComponentContent() {
  it('should set the parameters from the component content', () => {
    const componentContent = component.componentContent;
    expect(component.frequency).toEqual(componentContent.startingFrequency);
    expect(component.oscilloscopeWidth).toEqual(componentContent.oscilloscopeWidth);
    expect(component.oscilloscopeHeight).toEqual(componentContent.oscilloscopeHeight);
    expect(component.gridCellSize).toEqual(componentContent.gridCellSize);
    expect(component.oscillatorTypes.length).toEqual(2);
    expect(component.amplitude).toEqual(componentContent.startingAmplitude);
    expect(component.canStudentEditAmplitude).toEqual(componentContent.canStudentEditAmplitude);
    expect(component.canStudentViewAmplitudeInput).toEqual(
      componentContent.canStudentViewAmplitudeInput
    );
    expect(component.canStudentEditFrequency).toEqual(componentContent.canStudentEditFrequency);
    expect(component.canStudentViewFrequencyInput).toEqual(
      componentContent.canStudentViewFrequencyInput
    );
  });
}

function callPlayWhenTheTogglePlayIsCalled() {
  it('should call play when the toggle play is called', () => {
    const playSpy = spyOn(component, 'play');
    component.togglePlay();
    expect(playSpy).toHaveBeenCalled();
  });
}

function repopulateStudentWork() {
  it('should repopulate student work that only has frequency data', () => {
    const componentState = {
      studentData: {
        frequenciesPlayed: frequenciesPlayed
      }
    };
    component.setStudentWork(componentState);
    expect(component.frequenciesPlayed).toEqual(frequenciesPlayed);
  });
  it('should repopulate student work that has frequency and amplitude data', () => {
    const componentState = {
      studentData: {
        amplitudesPlayed: amplitudesPlayed,
        frequenciesPlayed: frequenciesPlayed
      }
    };
    component.setStudentWork(componentState);
    expect(component.frequenciesPlayed).toEqual(frequenciesPlayed);
  });
}

function createComponentState() {
  it(
    'should create component state',
    waitForAsync(() => {
      component.amplitudesPlayed = amplitudesPlayed;
      component.frequenciesPlayed = frequenciesPlayed;
      component.createComponentState('save').then((componentState: any) => {
        expect(componentState.componentId).toEqual(componentId);
        expect(componentState.nodeId).toEqual(nodeId);
        expect(componentState.studentData.frequenciesPlayed).toEqual(frequenciesPlayed);
        expect(componentState.studentData.amplitudesPlayed).toEqual(amplitudesPlayed);
      });
    })
  );
}

function addAmplitudeDataToStudentData() {
  it('should add amplitude data to student data', () => {
    component.amplitudesPlayed = [44, 20, 30, 20];
    const studentData: any = {};
    component.addAmplitudeDataToStudentData(studentData);
    expect(studentData.amplitudesPlayed).toEqual([44, 20, 30, 20]);
    expect(studentData.amplitudesPlayedSorted).toEqual([20, 20, 30, 44]);
    expect(studentData.numberOfAmplitudesPlayed).toEqual(4);
    expect(studentData.numberOfUniqueAmplitudesPlayed).toEqual(3);
    expect(studentData.minAmplitudePlayed).toEqual(20);
    expect(studentData.maxAmplitudePlayed).toEqual(44);
  });
}

function addFrequencyDataToStudentData() {
  it('should add frequency data to student data', () => {
    component.frequenciesPlayed = [440, 800, 200, 440];
    const studentData: any = {};
    component.addFrequencyDataToStudentData(studentData);
    expect(studentData.frequenciesPlayed).toEqual([440, 800, 200, 440]);
    expect(studentData.frequenciesPlayedSorted).toEqual([200, 440, 440, 800]);
    expect(studentData.numberOfFrequenciesPlayed).toEqual(4);
    expect(studentData.numberOfUniqueFrequenciesPlayed).toEqual(3);
    expect(studentData.minFrequencyPlayed).toEqual(200);
    expect(studentData.maxFrequencyPlayed).toEqual(800);
  });
}
