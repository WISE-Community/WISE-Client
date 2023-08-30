import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { AudioOscillatorService } from '../audioOscillatorService';
import { AudioOscillatorAuthoring } from './audio-oscillator-authoring.component';

let component: AudioOscillatorAuthoring;
let fixture: ComponentFixture<AudioOscillatorAuthoring>;
let getComponentSpy;

describe('AudioOscillatorAuthoring', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatInputModule,
        ReactiveFormsModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [EditComponentPrompt, AudioOscillatorAuthoring],
      providers: [ProjectAssetService, TeacherProjectService]
    });
    fixture = TestBed.createComponent(AudioOscillatorAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    component.componentContent = componentContent;
    getComponentSpy = spyOn(TestBed.inject(TeacherProjectService), 'getComponent');
    getComponentSpy.and.returnValue(componentContent);
    fixture.detectChanges();
  });

  populateCheckedOscillatorTypes();
  initializeStartingAmplitude();
  showFrequencyInputChanged();
  showAmplitudeInputChanged();
});

function createComponentContent() {
  return {
    oscillatorTypes: ['sine'],
    showSaveButton: false,
    showSubmitButton: false,
    type: 'AudioOscillator'
  };
}

function populateCheckedOscillatorTypes() {
  it('should populate checked oscillator types', () => {
    component.componentContent.oscillatorTypes = ['sine', 'square'];
    component.populateCheckedOscillatorTypes();
    expect(component.sineChecked).toEqual(true);
    expect(component.squareChecked).toEqual(true);
    expect(component.triangleChecked).toEqual(false);
    expect(component.sawtoothChecked).toEqual(false);
  });
}

function initializeStartingAmplitude() {
  it('should initialize starting amplitude', () => {
    delete component.componentContent.startingAmplitude;
    component.initializeStartingAmplitude();
    expect(component.componentContent.startingAmplitude).toEqual(
      TestBed.inject(AudioOscillatorService).defaultStartingAmplitude
    );
  });
}

function showFrequencyInputChanged() {
  it('should handle show frequency input changed', () => {
    component.componentContent.canStudentEditFrequency = true;
    component.showFrequencyInputChanged();
    expect(component.componentContent.canStudentEditFrequency).toEqual(false);
  });
}

function showAmplitudeInputChanged() {
  it('should handle show amplitude input changed', () => {
    component.componentContent.canStudentEditAmplitude = true;
    component.showAmplitudeInputChanged();
    expect(component.componentContent.canStudentEditAmplitude).toEqual(false);
  });
}
