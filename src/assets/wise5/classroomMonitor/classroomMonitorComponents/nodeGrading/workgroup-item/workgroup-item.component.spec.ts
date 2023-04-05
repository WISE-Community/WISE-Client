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

  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit', () => {
    it('should set the components that are visible to the student', () => {
      const component1 = { id: 'component1', type: 'OpenResponse' };
      const component2 = { id: 'component2', type: 'OpenResponse' };
      getComponentsSpy.and.returnValue([component1, component2]);
      component.workgroupData = {
        nodeStatus: {
          componentStatuses: {
            component1: {
              isVisible: true
            },
            component2: {
              isVisible: false
            }
          }
        }
      };
      component.ngOnInit();
      expect(component.componentIdToIsVisible[component1.id]).toEqual(true);
      expect(component.componentIdToIsVisible[component2.id]).toEqual(false);
    });
  });
}
