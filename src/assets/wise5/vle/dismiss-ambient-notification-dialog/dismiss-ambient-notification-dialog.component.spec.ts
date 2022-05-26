import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { UtilService } from '../../services/utilService';
import { DismissAmbientNotificationDialogComponent } from './dismiss-ambient-notification-dialog.component';

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
        UpgradeModule
      ],
      declarations: [DismissAmbientNotificationDialogComponent],
      providers: [
        AnnotationService,
        ConfigService,
        FormBuilder,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            data: { dismissCode: DISMISS_CODE }
          }
        },
        { provide: MatDialogRef, useValue: { close() {} } },
        ProjectService,
        SessionService,
        StudentDataService,
        TagService,
        UtilService
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
