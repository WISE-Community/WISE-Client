import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { DisplayBranchPathStepsComponent } from './display-branch-path-steps.component';

describe('DisplayBranchPathStepsComponent', () => {
  let component: DisplayBranchPathStepsComponent;
  let fixture: ComponentFixture<DisplayBranchPathStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayBranchPathStepsComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayBranchPathStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
