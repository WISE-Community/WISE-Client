import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { copy } from '../../../common/object/object';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { DialogGuidanceAuthoringComponent } from './dialog-guidance-authoring.component';

const componentContent = {
  id: 'i64ex48j1z',
  type: 'DialogGuidance',
  prompt: '',
  feedbackRules: [],
  showSaveButton: false,
  showSubmitButton: false,
  isComputerAvatarEnabled: false
};

describe('DialogGuidanceAuthoringComponent', () => {
  let component: DialogGuidanceAuthoringComponent;
  let fixture: ComponentFixture<DialogGuidanceAuthoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogGuidanceAuthoringComponent, StudentTeacherCommonServicesModule],
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
    fixture = TestBed.createComponent(DialogGuidanceAuthoringComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'isDefaultLocale').and.returnValue(true);
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      copy(componentContent)
    );
    component.componentContent = copy(componentContent);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
