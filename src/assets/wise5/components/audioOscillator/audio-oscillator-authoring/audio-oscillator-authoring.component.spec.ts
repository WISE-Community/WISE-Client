import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { AudioOscillatorService } from '../audioOscillatorService';
import { AudioOscillatorAuthoring } from './audio-oscillator-authoring.component';

let component: AudioOscillatorAuthoring;
let fixture: ComponentFixture<AudioOscillatorAuthoring>;
let getComponentByNodeIdAndComponentIdSpy;

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
        UpgradeModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [EditComponentPrompt, AudioOscillatorAuthoring],
      providers: [ProjectAssetService, TeacherProjectService]
    });
    fixture = TestBed.createComponent(AudioOscillatorAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    component.componentContent = componentContent;
    getComponentByNodeIdAndComponentIdSpy = spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    );
    getComponentByNodeIdAndComponentIdSpy.and.returnValue(componentContent);
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
    component.authoringComponentContent.oscillatorTypes = ['sine', 'square'];
    component.populateCheckedOscillatorTypes();
    expect(component.sineChecked).toEqual(true);
    expect(component.squareChecked).toEqual(true);
    expect(component.triangleChecked).toEqual(false);
    expect(component.sawtoothChecked).toEqual(false);
  });
}

function initializeStartingAmplitude() {
  it('should initialize starting amplitude', () => {
    delete component.authoringComponentContent.startingAmplitude;
    component.initializeStartingAmplitude();
    expect(component.authoringComponentContent.startingAmplitude).toEqual(
      TestBed.inject(AudioOscillatorService).defaultStartingAmplitude
    );
  });
}

function showFrequencyInputChanged() {
  it('should handle show frequency input changed', () => {
    component.authoringComponentContent.canStudentEditFrequency = true;
    component.showFrequencyInputChanged();
    expect(component.authoringComponentContent.canStudentEditFrequency).toEqual(false);
  });
}

function showAmplitudeInputChanged() {
  it('should handle show amplitude input changed', () => {
    component.authoringComponentContent.canStudentEditAmplitude = true;
    component.showAmplitudeInputChanged();
    expect(component.authoringComponentContent.canStudentEditAmplitude).toEqual(false);
  });
}
