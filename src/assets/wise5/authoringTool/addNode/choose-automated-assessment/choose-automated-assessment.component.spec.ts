import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ChooseAutomatedAssessmentComponent } from './choose-automated-assessment.component';

describe('ChooseAutomatedAssessmentComponent', () => {
  let component: ChooseAutomatedAssessmentComponent;
  let fixture: ComponentFixture<ChooseAutomatedAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseAutomatedAssessmentComponent],
      providers: [
        MockProvider(TeacherProjectService, {
          getAutomatedAssessmentProjectId: () => 1,
          retrieveProjectById: () =>
            Promise.resolve({
              id: 1,
              title: 'Test Project'
            })
        }),
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
