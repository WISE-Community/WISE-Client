import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigureAutomatedAssessmentComponent } from './configure-automated-assessment.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDividerModule } from '@angular/material/divider';
import { CopyNodesService } from '../../../services/copyNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { InsertNodesService } from '../../../services/insertNodesService';

describe('ConfigureAutomatedAssessmentComponent', () => {
  let component: ConfigureAutomatedAssessmentComponent;
  let fixture: ComponentFixture<ConfigureAutomatedAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfigureAutomatedAssessmentComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatDividerModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [CopyNodesService, InsertNodesService, TeacherProjectService]
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
