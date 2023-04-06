import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { WorkgroupItemComponent } from './workgroup-item.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let component: WorkgroupItemComponent;
let fixture: ComponentFixture<WorkgroupItemComponent>;
let getComponentsSpy: jasmine.Spy;
let teacherProjectService: TeacherProjectService;

describe('WorkgroupItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkgroupItemComponent],
      imports: [ClassroomMonitorTestingModule],
      providers: [TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'nodeHasWork').and.returnValue(true);
    getComponentsSpy = spyOn(teacherProjectService, 'getComponents');
    getComponentsSpy.and.returnValue([]);
    fixture = TestBed.createComponent(WorkgroupItemComponent);
    component = fixture.componentInstance;
    component.workgroupData = {
      nodeStatus: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
