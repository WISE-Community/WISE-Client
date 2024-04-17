import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseAutomatedAssessmentComponent } from './choose-automated-assessment.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDividerModule } from '@angular/material/divider';

describe('ChooseAutomatedAssessmentComponent', () => {
  let component: ChooseAutomatedAssessmentComponent;
  let fixture: ComponentFixture<ChooseAutomatedAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseAutomatedAssessmentComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatDividerModule,
        MatRadioModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();
    window.history.pushState({}, '', '');
    fixture = TestBed.createComponent(ChooseAutomatedAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
