import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../../services/configService';
import { UpdateWorkgroupService } from '../../../../../../app/services/updateWorkgroupService';
import { ChangeTeamPeriodDialogComponent } from '../change-team-period-dialog/change-team-period-dialog.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CdkDropList,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { MoveUserConfirmDialogComponent } from '../move-user-confirm-dialog/move-user-confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'manage-team',
  styleUrls: ['manage-team.component.scss'],
  templateUrl: 'manage-team.component.html'
})
export class ManageTeamComponent {
  @Input() team: any;

  avatarColor: string;
  canChangePeriod: boolean;
  isUnassigned: boolean;

  constructor(
    private dialog: MatDialog,
    private ConfigService: ConfigService,
    private UpdateWorkgroupService: UpdateWorkgroupService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.avatarColor = this.ConfigService.getAvatarColorForWorkgroupId(this.team.workgroupId);
    this.isUnassigned = this.team.workgroupId == null;
    this.canChangePeriod =
      this.ConfigService.getPermissions().canGradeStudentWork &&
      this.team.users.length > 0 &&
      !this.isUnassigned;
  }

  changePeriod(event: Event) {
    event.preventDefault();
    this.dialog.open(ChangeTeamPeriodDialogComponent, {
      data: this.team,
      panelClass: 'dialog-sm'
    });
  }

  dragEnter(event: CdkDragEnter) {
    event.container.element.nativeElement.classList.add('primary-bg');
  }

  dragExit(event: CdkDragExit) {
    event.container.element.nativeElement.classList.remove('primary-bg');
  }

  canDrop(drag: CdkDrag, drop: CdkDropList): boolean {
    return !drop.element.nativeElement.classList.contains('unassigned') && drop.data.length < 3;
  }

  drop(event: CdkDragDrop<string[]>) {
    const containerEl = event.container.element.nativeElement;
    const itemEl = event.item.element.nativeElement;
    if (event.previousContainer !== event.container) {
      itemEl.style.opacity = '.4';
      this.dialog
        .open(MoveUserConfirmDialogComponent, {
          panelClass: 'dialog-sm',
          data: event.item.data != null
        })
        .afterClosed()
        .subscribe((doMoveUser: boolean) => {
          if (doMoveUser) {
            this.moveUser(event);
          }
          containerEl.classList.remove('primary-bg');
          itemEl.style.opacity = '1';
        });
    } else {
      containerEl.classList.remove('primary-bg');
      itemEl.style.opacity = '1';
    }
  }

  private moveUser(event: CdkDragDrop<string[]>) {
    const user: any = event.previousContainer.data[event.previousIndex];
    this.UpdateWorkgroupService.moveMember(
      user.id,
      event.item.data,
      this.team.workgroupId,
      this.team.periodId
    ).subscribe(() => {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.ConfigService.retrieveConfig(
        `/api/config/classroomMonitor/${this.ConfigService.getRunId()}`
      );
      this.snackBar.open($localize`Moved student to Team ${this.team.workgroupId}.`);
    });
  }
}
