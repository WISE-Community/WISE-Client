import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Node } from '../../../common/Node';
import { MockProviders } from 'ng-mocks';
import { WorkgroupService } from '../../../../../app/services/workgroup.service';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { MultipleChoiceService } from '../../../components/multipleChoice/multipleChoiceService';
import { ComponentCompletionComponent } from './component-completion.component';

let component: ComponentCompletionComponent;
let fixture: ComponentFixture<ComponentCompletionComponent>;
describe('ComponentProgressComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentCompletionComponent],
      providers: [
        MockProviders(
          ComponentServiceLookupService,
          MultipleChoiceService,
          TeacherDataService,
          WorkgroupService
        )
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentCompletionComponent);
    component = fixture.componentInstance;
    component.component = { id: 'component1', maxScore: 10 };
    component.node = { id: 'node1' } as Node;
    component.periodId = 1;
  });
  ngOnChanges();
});

function ngOnChanges() {
  describe('ngOnChanges()', () => {
    beforeEach(() => {
      const workgroups = new Map<number, any>();
      workgroups.set(1, {});
      workgroups.set(2, {});
      spyOn(TestBed.inject(WorkgroupService), 'getWorkgroupsInPeriod').and.returnValue(workgroups);
      spyOn(TestBed.inject(ComponentServiceLookupService), 'getService').and.returnValue(
        new MultipleChoiceService()
      );
    });
    describe('no student completed this work', () => {
      beforeEach(() =>
        spyOn(
          TestBed.inject(TeacherDataService),
          'getComponentStatesByWorkgroupIdAndComponentId'
        ).and.returnValue([])
      );
      it('shows "0%"', () => {
        component.ngOnChanges();
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent.trim()).toEqual('0%');
      });
    });
    describe('half of the students completed this work', () => {
      beforeEach(() =>
        spyOn(
          TestBed.inject(TeacherDataService),
          'getComponentStatesByWorkgroupIdAndComponentId'
        ).and.returnValues([], [{ studentData: { studentChoices: [{ id: 'choice1' }] } }])
      );
      it('shows "50%"', () => {
        component.ngOnChanges();
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent.trim()).toEqual('50%');
      });
    });
  });
}
