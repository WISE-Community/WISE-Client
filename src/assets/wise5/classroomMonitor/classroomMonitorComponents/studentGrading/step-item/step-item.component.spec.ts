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

  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit', () => {
    it('should set the components that are visible to the student', () => {
      const component1 = { id: 'component1', type: 'OpenResponse' };
      const component2 = { id: 'component2', type: 'OpenResponse' };
      spyOn(teacherProjectService, 'getComponents').and.returnValue([component1, component2]);
      component.stepData = {
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
