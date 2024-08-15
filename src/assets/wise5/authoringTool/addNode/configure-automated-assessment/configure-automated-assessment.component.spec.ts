import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigureAutomatedAssessmentComponent } from './configure-automated-assessment.component';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MatDividerModule } from '@angular/material/divider';
import { CopyNodesService } from '../../../services/copyNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { InsertNodesService } from '../../../services/insertNodesService';
import { InsertFirstNodeInBranchPathService } from '../../../services/insertFirstNodeInBranchPathService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfigureAutomatedAssessmentComponent', () => {
  let component: ConfigureAutomatedAssessmentComponent;
  let fixture: ComponentFixture<ConfigureAutomatedAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigureAutomatedAssessmentComponent],
      imports: [
        FormsModule,
        MatButtonModule,
        MatDividerModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        CopyNodesService,
        InsertFirstNodeInBranchPathService,
        InsertNodesService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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
