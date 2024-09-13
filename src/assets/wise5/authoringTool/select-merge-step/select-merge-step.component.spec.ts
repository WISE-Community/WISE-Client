import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectMergeStepComponent } from './select-merge-step.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

let teacherProjectService: TeacherProjectService;

describe('SelectMergeStepComponent', () => {
  let component: SelectMergeStepComponent;
  let fixture: ComponentFixture<SelectMergeStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SelectMergeStepComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();
    teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'getFlattenedProjectAsNodeIds').and.returnValue([]);
    fixture = TestBed.createComponent(SelectMergeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
