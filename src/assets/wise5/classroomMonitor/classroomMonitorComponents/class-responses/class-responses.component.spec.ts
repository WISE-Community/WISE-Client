import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassResponsesComponent } from './class-responses.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { TeacherDataService } from '../../../services/teacherDataService';
import { of } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { WorkgroupSelectAutocompleteComponent } from '../../../../../app/classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';

describe('ClassResponsesComponent', () => {
  let component: ClassResponsesComponent;
  let fixture: ComponentFixture<ClassResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(WorkgroupSelectAutocompleteComponent)],
      imports: [ClassResponsesComponent, ClassroomMonitorTestingModule]
    }).compileComponents();
    spyOn(TestBed.inject(TeacherDataService), 'retrieveStudentDataForNode').and.returnValue(of({}));
    fixture = TestBed.createComponent(ClassResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
