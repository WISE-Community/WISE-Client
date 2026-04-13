import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectInfoAuthoringComponent } from './project-info-authoring.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { ConfigService } from '../../services/configService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UserService } from '../../../../app/services/user.service';
import { MockComponent, MockProviders } from 'ng-mocks';
import { EditProjectLanguageSettingComponent } from '../project-info/edit-project-language-setting/edit-project-language-setting.component';

describe('ProjectInfoAuthoringComponent', () => {
  let component: ProjectInfoAuthoringComponent;
  let fixture: ComponentFixture<ProjectInfoAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectInfoAuthoringComponent, MockComponent(EditProjectLanguageSettingComponent)],
      providers: [
        MockProviders(ConfigService, TeacherProjectService, UserService),
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
    spyOn(TestBed.inject(TeacherProjectService), 'getProjectMetadata').and.returnValue({
      authors: []
    });
    spyOn(TestBed.inject(ConfigService), 'getConfigParam').and.returnValue('{ "fields": [] }');
    spyOn(TestBed.inject(UserService), 'getUserId').and.returnValue(1);
    fixture = TestBed.createComponent(ProjectInfoAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
