import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeGradingComponent } from './node-grading.component';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherDataService } from '../../../../services/teacherDataService';

describe('NodeGradingComponent', () => {
  let component: NodeGradingComponent;
  let fixture: ComponentFixture<NodeGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, NodeGradingComponent]
    }).compileComponents();
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'nodeHasWork').and.returnValue(false);
    const dataService = TestBed.inject(TeacherDataService);
    spyOn(dataService, 'getCurrentPeriodId').and.returnValue(1);
    fixture = TestBed.createComponent(NodeGradingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
