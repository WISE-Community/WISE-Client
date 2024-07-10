import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStepButtonComponent } from './add-step-button.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { provideRouter } from '@angular/router';

let teacherProjectService: TeacherProjectService;

describe('AddStepButtonComponent', () => {
  let component: AddStepButtonComponent;
  let fixture: ComponentFixture<AddStepButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AddStepButtonComponent,
        HttpClientTestingModule,
        MatIconModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [provideRouter([]), TeacherProjectService]
    });
    teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'isBranchMergePoint').and.returnValue(false);
    fixture = TestBed.createComponent(AddStepButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
