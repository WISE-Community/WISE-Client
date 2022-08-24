import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { StudentGradingToolsComponent } from './student-grading-tools.component';

describe('StudentGradingToolsComponent', () => {
  let component: StudentGradingToolsComponent;
  let fixture: ComponentFixture<StudentGradingToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentGradingToolsComponent],
      imports: [ClassroomMonitorTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGradingToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
