import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseAutomatedAssessmentComponent } from './choose-automated-assessment.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ChooseAutomatedAssessmentComponent', () => {
  let component: ChooseAutomatedAssessmentComponent;
  let fixture: ComponentFixture<ChooseAutomatedAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseAutomatedAssessmentComponent, StudentTeacherCommonServicesModule],
      providers: [
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([])
      ]
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
