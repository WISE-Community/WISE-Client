import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { Notification } from '../../../../app/domain/notification';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { NodeService } from '../../services/nodeService';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatDialogActions,
    MatButton
  ],
  styles: ['.notification-dismiss__input { width: 100%; }'],
  templateUrl: './dismiss-ambient-notification-dialog.component.html'
})
export class DismissAmbientNotificationDialogComponent implements OnInit {
  private dismissSource: Subject<any> = new Subject<any>();
  public dismiss$: Observable<any> = this.dismissSource.asObservable();
  dismissCodeInput: string = '';
  errorMessage: string = $localize`Invalid dismiss code. Please try again.`;
  formGroup: FormGroup;
  hasDismissCode: boolean = false;
  isShowInvalidDismissCodeMessage: boolean = false;
  nodePositionAndTitle: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public notification: Notification,
    public dialogRef: MatDialogRef<DismissAmbientNotificationDialogComponent>,
    private formBuilder: FormBuilder,
    private nodeService: NodeService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.initializeFormGroup();
    this.initializeHasDismissCode();
    this.initializeNodePositionAndTitle();
    this.saveNotificationWindowOpenedEvent();
  }

  private initializeFormGroup(): void {
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

  private dismissCodeValidator(control: AbstractControl): ValidationErrors {
    if (this.isShowInvalidDismissCodeMessage) {
      control.get('dismissCode').setErrors({ incorrect: true });
    }
    return null;
  }

  private initializeHasDismissCode(): void {
    if (this.notification.data && this.notification.data.dismissCode) {
      this.hasDismissCode = true;
    }
  }

  private initializeNodePositionAndTitle(): void {
    this.nodePositionAndTitle = this.projectService.getNodePositionAndTitle(
      this.notification.nodeId
    );
  }

  checkDismissCode(): void {
    if (!this.hasDismissCode || this.dismissCodeInput === this.notification.data.dismissCode) {
      this.dismissSource.next(this.notification);
      this.saveNotificationDismissedWithCodeEvent();
      this.dialogRef.close();
    } else {
      this.isShowInvalidDismissCodeMessage = true;
      this.formGroup.controls['dismissCode'].updateValueAndValidity();
    }
  }

  private saveNotificationWindowOpenedEvent(): void {
    this.saveEvent('currentAmbientNotificationWindowOpened');
  }

  private saveNotificationDismissedWithCodeEvent(): void {
    this.saveEvent('currentAmbientNotificationDimissedWithCode');
  }

  private saveNotificationWindowClosedEvent(): void {
    this.saveEvent('currentAmbientNotificationWindowClosed');
  }

  private saveEvent(eventName: string): void {
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
      this.nodeService.setCurrentNode(goToNodeId);
    }
  }

  closeDialog(): void {
    this.saveNotificationWindowClosedEvent();
    this.dialogRef.close();
  }
}
