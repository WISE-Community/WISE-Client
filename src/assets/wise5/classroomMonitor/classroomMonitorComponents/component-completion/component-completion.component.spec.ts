import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Node } from '../../../common/Node';
import { MockProviders } from 'ng-mocks';
import { WorkgroupService } from '../../../../../app/services/workgroup.service';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { MultipleChoiceService } from '../../../components/multipleChoice/multipleChoiceService';
import { ComponentCompletionComponent } from './component-completion.component';
import { ClassroomStatusService } from '../../../services/classroomStatusService';

import { ComponentInfoService } from '../../../services/componentInfoService';

let component: ComponentCompletionComponent;
let fixture: ComponentFixture<ComponentCompletionComponent>;
let workgroupService: WorkgroupService;
let componentServiceLookupService: ComponentServiceLookupService;
let teacherDataService: TeacherDataService;
let classroomStatusService: ClassroomStatusService;
describe('ComponentCompletionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCompletionComponent],
      providers: [
        MockProviders(
          ClassroomStatusService,
          ComponentInfoService,
          ComponentServiceLookupService,
          TeacherDataService,
          WorkgroupService
        ),
        MultipleChoiceService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentCompletionComponent);
    component = fixture.componentInstance;
    component.component = { id: 'component1', maxScore: 10 };
    component.node = { id: 'node1' } as Node;
    component.periodId = 1;
    workgroupService = TestBed.inject(WorkgroupService);
    componentServiceLookupService = TestBed.inject(ComponentServiceLookupService);
    teacherDataService = TestBed.inject(TeacherDataService);
    classroomStatusService = TestBed.inject(ClassroomStatusService);
  });
  ngOnChanges();
});

function ngOnChanges() {
  describe('ngOnChanges()', () => {
    beforeEach(() => {
      const workgroups = new Map<number, any>();
      workgroups.set(1, {});
      workgroups.set(2, {});
      spyOn(workgroupService, 'getWorkgroupsInPeriod').and.returnValue(workgroups);
      spyOn(componentServiceLookupService, 'getService').and.returnValue(
        TestBed.inject(MultipleChoiceService)
      );
      spyOn(classroomStatusService, 'hasStudentStatus').and.returnValue(true);
    });
    describe('no student completed this work', () => {
      beforeEach(() =>
        spyOn(teacherDataService, 'getComponentStatesByWorkgroupIdAndComponentId').and.returnValue(
          []
        )
      );
      it('shows "Responses: 0"', () => {
        component.ngOnChanges();
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent.trim()).toEqual('Responses: 0');
      });
    });
    describe('one of the students completed this work', () => {
      beforeEach(() =>
        spyOn(teacherDataService, 'getComponentStatesByWorkgroupIdAndComponentId').and.returnValues(
          [],
          [{ studentData: { studentChoices: [{ id: 'choice1' }] } }]
        )
      );
      it('shows "Responses: 1"', () => {
        component.ngOnChanges();
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent.trim()).toEqual('Responses: 1');
      });
    });
  });
}
