import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StudentDataService } from '../../services/studentDataService';
import { DismissAmbientNotificationDialogComponent } from './dismiss-ambient-notification-dialog.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';

let component: DismissAmbientNotificationDialogComponent;
const DISMISS_CODE: string = 'computer';
let fixture: ComponentFixture<DismissAmbientNotificationDialogComponent>;
const INCORRECT_DISMISS_CODE: string = 'candy';
const nodeId = 'node1';
let saveVLEEventSpy: jasmine.Spy;

describe('DismissAmbientNotificationDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [DismissAmbientNotificationDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data: { dismissCode: DISMISS_CODE }
          }
        },
        { provide: MatDialogRef, useValue: { close() {} } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    saveVLEEventSpy = spyOn(TestBed.inject(StudentDataService), 'saveVLEEvent').and.callFake(() => {
      return Promise.resolve({});
    });
    fixture = TestBed.createComponent(DismissAmbientNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  checkDismissCode();
  visitNode();
});

function checkDismissCode(): void {
  describe('checkDismissCode()', () => {
    beforeEach(() => {
      expect(component.isShowInvalidDismissCodeMessage).toEqual(false);
    });
    it('should show invalid dismiss code message when user has invalid input code', () => {
      dismissCodeShouldShowInvalidDismissCodeMessage(INCORRECT_DISMISS_CODE, true);
    });
    it('should not show invalid dismiss code message when user has valid input code', () => {
      dismissCodeShouldShowInvalidDismissCodeMessage(DISMISS_CODE, false);
    });
  });
}

function dismissCodeShouldShowInvalidDismissCodeMessage(
  dismissCode: string,
  isShowInvalidDismissCodeMessage: boolean
) {
  component.dismissCodeInput = dismissCode;
  component.checkDismissCode();
  expect(component.isShowInvalidDismissCodeMessage).toEqual(isShowInvalidDismissCodeMessage);
}

function visitNode(): void {
  describe('visitNode', () => {
    it('should visit node', () => {
      const endCurrentNodeSpy = spyOn(
        TestBed.inject(StudentDataService),
        'endCurrentNodeAndSetCurrentNodeByNodeId'
      ).and.callFake(() => {});
      component.notification.nodeId = nodeId;
      component.visitNode();
      expect(saveVLEEventSpy).toHaveBeenCalled();
      expect(endCurrentNodeSpy).toHaveBeenCalledWith(nodeId);
    });
  });
}
