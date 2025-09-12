import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { AiChatAuthoringComponent } from './ai-chat-authoring.component';

describe('AiChatAuthoringComponent', () => {
  let component: AiChatAuthoringComponent;
  let fixture: ComponentFixture<AiChatAuthoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AiChatAuthoringComponent, StudentTeacherCommonServicesModule],
      providers: [
        ProjectAssetService,
        TeacherNodeService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getLocale').and.returnValue(new ProjectLocale({ default: 'en-US' }));
    spyOn(projectService, 'isDefaultLocale').and.returnValue(true);
    fixture = TestBed.createComponent(AiChatAuthoringComponent);
    component = fixture.componentInstance;
    component.componentContent = {
      id: 'component1',
      type: 'aiChat',
      computerAvatarSettings: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
