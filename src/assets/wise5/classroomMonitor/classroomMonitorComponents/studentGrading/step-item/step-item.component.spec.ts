import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { StepItemComponent } from './step-item.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

let component: StepItemComponent;
let fixture: ComponentFixture<StepItemComponent>;
let teacherProjectService: TeacherProjectService;
describe('StepItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, StepItemComponent],
      providers: [TeacherProjectService]
    }).compileComponents();
  });

  beforeEach(() => {
    teacherProjectService = TestBed.inject(TeacherProjectService);
    fixture = TestBed.createComponent(StepItemComponent);
    component = fixture.componentInstance;
    component.stepData = {
      nodeStatus: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
