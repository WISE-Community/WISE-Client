import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStepButtonComponent } from './add-step-button.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';

describe('AddStepButtonComponent', () => {
  let component: AddStepButtonComponent;
  let fixture: ComponentFixture<AddStepButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddStepButtonComponent],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    });
    fixture = TestBed.createComponent(AddStepButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
