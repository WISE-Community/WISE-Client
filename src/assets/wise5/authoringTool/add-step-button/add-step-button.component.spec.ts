import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStepButtonComponent } from './add-step-button.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

let teacherProjectService: TeacherProjectService;

describe('AddStepButtonComponent', () => {
  let component: AddStepButtonComponent;
  let fixture: ComponentFixture<AddStepButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddStepButtonComponent, StudentTeacherCommonServicesModule],
      providers: [
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([])
      ]
    });
    teacherProjectService = TestBed.inject(TeacherProjectService);
    fixture = TestBed.createComponent(AddStepButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
