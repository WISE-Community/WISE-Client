import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStepButtonComponent } from './add-step-button.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AddStepButtonComponent', () => {
  let component: AddStepButtonComponent;
  let fixture: ComponentFixture<AddStepButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AddStepButtonComponent,
        MatIconModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule],
    providers: [TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(AddStepButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
