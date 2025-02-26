import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentClassResponsesComponent } from './component-class-responses.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { TeacherDataService } from '../../../services/teacherDataService';
import { of } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';

describe('ComponentClassResponsesComponent', () => {
  let component: ComponentClassResponsesComponent;
  let fixture: ComponentFixture<ComponentClassResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(WorkgroupSelectAutocompleteComponent)],
      imports: [ComponentClassResponsesComponent, ClassroomMonitorTestingModule]
    }).compileComponents();
    spyOn(TestBed.inject(TeacherDataService), 'retrieveStudentDataForNode').and.returnValue(of({}));
    fixture = TestBed.createComponent(ComponentClassResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
