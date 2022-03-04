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
const dismissCode: string = 'computer';
let fixture: ComponentFixture<DismissAmbientNotificationDialogComponent>;
const incorrectDismissCode: string = 'candy';
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
            notification: { data: { dismissCode: dismissCode } },
            dismissNotification: () => {}
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
    saveVLEEventSpy = spyOn(
      TestBed.inject(StudentDataService),
      'saveVLEEvent'
    ).and.callFake(() => {});
    fixture = TestBed.createComponent(DismissAmbientNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  checkDismissCode();
  visitNode();
});

function checkDismissCode(): void {
  describe('checkDismissCode()', () => {
    it('should check dismiss code when user has invalid input code', () => {
      component.dismissCodeInput = incorrectDismissCode;
      expect(component.isShowInvalidDismissCodeMessage).toEqual(false);
      component.checkDismissCode();
      expect(component.isShowInvalidDismissCodeMessage).toEqual(true);
    });

    it('should check dismiss code when user has correct input code', () => {
      component.dismissCodeInput = dismissCode;
      expect(component.isShowInvalidDismissCodeMessage).toEqual(false);
      component.checkDismissCode();
      expect(component.isShowInvalidDismissCodeMessage).toEqual(false);
    });
  });
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
