import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ConfigService } from '../../services/configService';
import { ProjectListComponent } from './project-list.component';
import { CopyProjectService } from '../../services/copyProjectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListComponent, StudentTeacherCommonServicesModule],
      providers: [
        { provide: CopyProjectService, useValue: {} },
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
    spyOn(TestBed.inject(ConfigService), 'getConfigParam').and.returnValue([]);
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
