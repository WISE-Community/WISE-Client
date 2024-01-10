import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { DialogResponsesComponent } from '../dialog-responses/dialog-responses.component';
import { DialogGuidanceShowWorkComponent } from './dialog-guidance-show-work.component';

describe('DialogGuidanceShowWorkComponent', () => {
  let component: DialogGuidanceShowWorkComponent;
  let fixture: ComponentFixture<DialogGuidanceShowWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      declarations: [DialogGuidanceShowWorkComponent, DialogResponsesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceShowWorkComponent);
    component = fixture.componentInstance;
    component.componentState = {
      studentData: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
