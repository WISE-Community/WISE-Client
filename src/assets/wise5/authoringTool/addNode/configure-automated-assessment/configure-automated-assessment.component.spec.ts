import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigureAutomatedAssessmentComponent } from './configure-automated-assessment.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { CopyNodesService } from '../../../services/copyNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { InsertNodesService } from '../../../services/insertNodesService';
import { InsertFirstNodeInBranchPathService } from '../../../services/insertFirstNodeInBranchPathService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ConfigureAutomatedAssessmentComponent', () => {
  let component: ConfigureAutomatedAssessmentComponent;
  let fixture: ComponentFixture<ConfigureAutomatedAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ConfigureAutomatedAssessmentComponent, StudentTeacherCommonServicesModule],
      providers: [
        CopyNodesService,
        InsertFirstNodeInBranchPathService,
        InsertNodesService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();
    window.history.pushState(
      {
        node: {
          components: []
        },
        importFromProjectId: 1
      },
      '',
      ''
    );
    fixture = TestBed.createComponent(ConfigureAutomatedAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
