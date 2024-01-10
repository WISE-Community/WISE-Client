import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { StepItemComponent } from './step-item.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let component: StepItemComponent;
let fixture: ComponentFixture<StepItemComponent>;
let teacherProjectService: TeacherProjectService;

describe('StepItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepItemComponent],
      imports: [ClassroomMonitorTestingModule],
      providers: [TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
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
