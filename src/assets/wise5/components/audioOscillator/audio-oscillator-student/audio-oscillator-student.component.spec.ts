import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
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

let component: AudioOscillatorStudent;
let fixture: ComponentFixture<AudioOscillatorStudent>;
let existingStudentData: any;
let newStudentData: any;

describe('AudioOscillatorStudent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, UpgradeModule],
      declarations: [AudioOscillatorStudent],
      providers: [
        AnnotationService,
        AudioOscillatorService,
        ComponentService,
        ConfigService,
        { provide: NodeService, useClass: MockService },
        { provide: NotebookService, useClass: MockService },
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioOscillatorStudent);
    spyOn(TestBed.get(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({});
    component = fixture.componentInstance;
    component.nodeId = 'node1';
    component.componentContent = {
      id: 'component1',
      type: 'AudioOscillator',
      prompt: 'Listen to multiple frequencies.',
      oscillatorTypes: ['sine', 'square'],
      oscilloscopeWidth: 800,
      oscilloscopeHeight: 400
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

  setFieldMinimum();
  setStudentWork();
  addFrequencyPlayed();
  mergeFrequenciesPlayed();
  mergeFrequenciesPlayedSorted();
  mergeNumberOfFrequenciesPlayed();
  mergeMinFrequencyPlayed();
  mergeMaxFrequencyPlayed();
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
  it('should set student work', () => {
    spyOn(component, 'processLatestStudentWork').and.callFake(() => {});
    const frequenciesPlayed = [400, 1600, 800];
    const frequenciesPlayedSorted = [400, 800, 1600];
    const numberOfFrequenciesPlayed = 3;
    const minFrequencyPlayed = 400;
    const maxFrequencyPlayed = 1600;
    const submitCounter = 0;
    const componentState = {
      studentData: {
        frequenciesPlayed: frequenciesPlayed,
        frequenciesPlayedSorted: frequenciesPlayedSorted,
        numberOfFrequenciesPlayed: numberOfFrequenciesPlayed,
        minFrequencyPlayed: minFrequencyPlayed,
        maxFrequencyPlayed: maxFrequencyPlayed,
        submitCounter: submitCounter
      }
    };
    component.setStudentWork(componentState);
    expect(component.frequency).toEqual(800);
    expect(component.frequenciesPlayed).toEqual(frequenciesPlayed);
    expect(component.frequenciesPlayedSorted).toEqual(frequenciesPlayedSorted);
    expect(component.numberOfFrequenciesPlayed).toEqual(numberOfFrequenciesPlayed);
    expect(component.minFrequencyPlayed).toEqual(minFrequencyPlayed);
    expect(component.maxFrequencyPlayed).toEqual(maxFrequencyPlayed);
    expect(component.submitCounter).toEqual(submitCounter);
  });
}

function addFrequencyPlayed() {
  it('should add frequency played', () => {
    component.frequenciesPlayed = [800];
    component.addFrequencyPlayed(400);
    expect(component.numberOfFrequenciesPlayed).toEqual(2);
    expect(component.frequenciesPlayed.length).toEqual(2);
    expect(component.frequenciesPlayed[0]).toEqual(800);
    expect(component.frequenciesPlayed[1]).toEqual(400);
    expect(component.minFrequencyPlayed).toEqual(400);
    expect(component.maxFrequencyPlayed).toEqual(800);
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

function mergeFrequenciesPlayedSorted() {
  it('should merge frequencies played sorted', () => {
    existingStudentData.frequenciesPlayedSorted = [100, 300];
    newStudentData.frequenciesPlayedSorted = [200];
    component.mergeFrequenciesPlayedSorted(existingStudentData, newStudentData);
    expect(existingStudentData.frequenciesPlayedSorted.length).toEqual(3);
    expect(existingStudentData.frequenciesPlayedSorted[0]).toEqual(100);
    expect(existingStudentData.frequenciesPlayedSorted[1]).toEqual(200);
    expect(existingStudentData.frequenciesPlayedSorted[2]).toEqual(300);
  });
}

function mergeNumberOfFrequenciesPlayed() {
  it('should merge the number of frequencies played', () => {
    existingStudentData.numberOfFrequenciesPlayed = 1;
    newStudentData.numberOfFrequenciesPlayed = 2;
    component.mergeNumberOfFrequenciesPlayed(existingStudentData, newStudentData);
    expect(existingStudentData.numberOfFrequenciesPlayed).toEqual(3);
  });
}

function mergeMinFrequencyPlayed() {
  it('should merge min frequency played when there was no previous min frequency', () => {
    existingStudentData.minFrequencyPlayed = null;
    newStudentData.minFrequencyPlayed = 100;
    component.mergeMinFrequencyPlayed(existingStudentData, newStudentData);
    expect(existingStudentData.minFrequencyPlayed).toEqual(100);
  });
  it('should merge min frequency played', () => {
    existingStudentData.minFrequencyPlayed = 200;
    newStudentData.minFrequencyPlayed = 100;
    component.mergeMinFrequencyPlayed(existingStudentData, newStudentData);
    expect(existingStudentData.minFrequencyPlayed).toEqual(100);
  });
}

function mergeMaxFrequencyPlayed() {
  it('should merge max frequency played when there was no previous max frequency', () => {
    existingStudentData.maxFrequencyPlayed = null;
    newStudentData.maxFrequencyPlayed = 200;
    component.mergeMaxFrequencyPlayed(existingStudentData, newStudentData);
    expect(existingStudentData.maxFrequencyPlayed).toEqual(200);
  });
  it('should merge max frequency played', () => {
    existingStudentData.maxFrequencyPlayed = 100;
    newStudentData.maxFrequencyPlayed = 200;
    component.mergeMaxFrequencyPlayed(existingStudentData, newStudentData);
    expect(existingStudentData.maxFrequencyPlayed).toEqual(200);
  });
}
