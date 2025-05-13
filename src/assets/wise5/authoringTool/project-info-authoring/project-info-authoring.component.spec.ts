import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectInfoAuthoringComponent } from './project-info-authoring.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ConfigService } from '../../services/configService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EditUnitResourcesComponent } from '../edit-unit-resources/edit-unit-resources.component';
import { EditUnitTypeComponent } from '../edit-unit-type/edit-unit-type.component';
import { MockProvider } from 'ng-mocks';
import { UserService } from '../../../../app/services/user.service';

fdescribe('ProjectInfoAuthoringComponent', () => {
  let component: ProjectInfoAuthoringComponent;
  let fixture: ComponentFixture<ProjectInfoAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectInfoAuthoringComponent],
      imports: [
        EditUnitResourcesComponent,
        EditUnitTypeComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        MockProvider(UserService),
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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
