import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { AudioOscillatorService } from '../audioOscillatorService';
import { AudioOscillatorAuthoring } from './audio-oscillator-authoring.component';

let component: AudioOscillatorAuthoring;
let fixture: ComponentFixture<AudioOscillatorAuthoring>;
let getComponentSpy;
describe('AudioOscillatorAuthoring', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AudioOscillatorAuthoring, StudentTeacherCommonServicesModule],
      providers: [
        ProjectAssetService,
        TeacherNodeService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en-US' })
    );
    fixture = TestBed.createComponent(AudioOscillatorAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    component.componentContent = componentContent;
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
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
