import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectInfoAuthoringComponent } from './project-info-authoring.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ConfigService } from '../../services/configService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ProjectInfoAuthoringComponent', () => {
  let component: ProjectInfoAuthoringComponent;
  let fixture: ComponentFixture<ProjectInfoAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ProjectInfoAuthoringComponent],
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    spyOn(TestBed.inject(TeacherProjectService), 'getProjectMetadata').and.returnValue({});
    spyOn(TestBed.inject(ConfigService), 'getConfigParam').and.returnValue('{ "fields": [] }');
    fixture = TestBed.createComponent(ProjectInfoAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
