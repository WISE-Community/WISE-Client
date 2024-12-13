import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeGradingComponent } from './node-grading.component';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { provideRouter } from '@angular/router';

describe('NodeGradingComponent', () => {
  let component: NodeGradingComponent;
  let fixture: ComponentFixture<NodeGradingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, NodeGradingComponent],
      providers: [provideRouter([])]
    }).compileComponents();
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'nodeHasWork').and.returnValue(false);
    spyOn(projectService, 'getComponents').and.returnValue([{ id: 'abc', type: 'MultipleChoice' }]);
    spyOn(projectService, 'componentHasWork').and.returnValue(true);
    const dataService = TestBed.inject(TeacherDataService);
    spyOn(dataService, 'getCurrentPeriodId').and.returnValue(1);
    fixture = TestBed.createComponent(NodeGradingComponent);
    component = fixture.componentInstance;
    component.ngOnChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
