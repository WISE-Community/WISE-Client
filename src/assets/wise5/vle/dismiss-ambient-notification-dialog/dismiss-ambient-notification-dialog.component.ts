import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';

@Component({
  selector: 'dismiss-ambient-notification-dialog',
  templateUrl: './dismiss-ambient-notification-dialog.component.html',
  styleUrls: ['./dismiss-ambient-notification-dialog.component.scss']
})
export class DismissAmbientNotificationDialogComponent implements OnInit {
  dismissCodeInput: string = '';
  errorMessage: string = $localize`Invalid dismiss code. Please try again.`;
  formGroup: FormGroup;
  hasDismissCode: boolean = false;
  isShowInvalidDismissCodeMessage: boolean = false;
  nodePositionAndTitle: string;
  notification: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DismissAmbientNotificationDialogComponent>,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {
    this.notification = data.notification;
  }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.initializeHasDismissCode();
    this.initializeNodePositionAndTitle();
    this.saveNotificationWindowOpenedEvent();
  }

  initializeFormGroup(): void {
    this.formGroup = this.formBuilder.group(
      {
        dismissCode: new FormControl('')
      },
      {
        validators: (control: AbstractControl): ValidationErrors => {
          return this.dismissCodeValidator(control);
        }
      }
    );
  }

  dismissCodeValidator(control: AbstractControl): ValidationErrors {
    if (this.isShowInvalidDismissCodeMessage) {
      control.get('dismissCode').setErrors({ incorrect: true });
    }
    return null;
  }

  initializeHasDismissCode(): void {
    if (this.notification.data && this.notification.data.dismissCode) {
      this.hasDismissCode = true;
    }
  }

  initializeNodePositionAndTitle(): void {
    this.nodePositionAndTitle = this.projectService.getNodePositionAndTitleByNodeId(
      this.notification.nodeId
    );
  }

  checkDismissCode(): void {
    if (!this.hasDismissCode || this.dismissCodeInput === this.notification.data.dismissCode) {
      this.data.dismissNotification(this.notification);
      this.saveNotificationDismissedWithCodeEvent();
      this.dialogRef.close();
    } else {
      this.isShowInvalidDismissCodeMessage = true;
      this.formGroup.controls['dismissCode'].updateValueAndValidity();
    }
  }

  saveNotificationWindowOpenedEvent(): void {
    this.saveEvent('currentAmbientNotificationWindowOpened');
  }

  saveNotificationDismissedWithCodeEvent(): void {
    this.saveEvent('currentAmbientNotificationDimissedWithCode');
  }

  saveNotificationWindowClosedEvent(): void {
    this.saveEvent('currentAmbientNotificationWindowClosed');
  }

  saveEvent(eventName: string): void {
    const nodeId = null;
    const componentId = null;
    const componentType = null;
    const category = 'Notification';
    const event = eventName;
    const eventData = {};
    this.studentDataService.saveVLEEvent(
      nodeId,
      componentId,
      componentType,
      category,
      event,
      eventData
    );
  }

  visitNode(): void {
    if (!this.hasDismissCode) {
      // only close notifications that don't require a dismiss code
      this.saveNotificationWindowClosedEvent();
    }

    const goToNodeId = this.notification.nodeId;
    if (goToNodeId != null) {
      this.studentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(goToNodeId);
    }
  }

  closeDialog(): void {
    this.saveNotificationWindowClosedEvent();
    this.dialogRef.close();
  }
}
