import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectStepComponent } from './select-step.component';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectStepComponent', () => {
  let component: SelectStepComponent;
  let fixture: ComponentFixture<SelectStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SelectStepComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [ProjectService]
    });
    fixture = TestBed.createComponent(SelectStepComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      'node1'
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
