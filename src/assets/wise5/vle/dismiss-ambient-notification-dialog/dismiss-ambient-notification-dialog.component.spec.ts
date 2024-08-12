import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StudentDataService } from '../../services/studentDataService';
import { DismissAmbientNotificationDialogComponent } from './dismiss-ambient-notification-dialog.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { NodeService } from '../../services/nodeService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: DismissAmbientNotificationDialogComponent;
const DISMISS_CODE: string = 'computer';
let fixture: ComponentFixture<DismissAmbientNotificationDialogComponent>;
const INCORRECT_DISMISS_CODE: string = 'candy';
const nodeId = 'node1';
let saveVLEEventSpy: jasmine.Spy;

describe('DismissAmbientNotificationDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DismissAmbientNotificationDialogComponent],
    imports: [BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        StudentTeacherCommonServicesModule],
    providers: [
        {
            provide: MAT_DIALOG_DATA,
            useValue: {
                data: { dismissCode: DISMISS_CODE }
            }
        },
        { provide: MatDialogRef, useValue: { close() { } } },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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
      const setCurrentNodeSpy = spyOn(
        TestBed.inject(NodeService),
        'setCurrentNode'
      ).and.callFake(() => {});
      component.notification.nodeId = nodeId;
      component.visitNode();
      expect(saveVLEEventSpy).toHaveBeenCalled();
      expect(setCurrentNodeSpy).toHaveBeenCalledWith(nodeId);
    });
  });
}
