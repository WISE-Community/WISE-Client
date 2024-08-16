import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayBranchPathStepsComponent } from './display-branch-path-steps.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { provideHttpClient } from '@angular/common/http';

describe('DisplayBranchPathStepsComponent', () => {
  let component: DisplayBranchPathStepsComponent;
  let fixture: ComponentFixture<DisplayBranchPathStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayBranchPathStepsComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(), TeacherProjectService]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayBranchPathStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
