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
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';

@Component({
  selector: 'manage-team',
  styleUrls: ['manage-team.component.scss'],
  templateUrl: 'manage-team.component.html'
})
export class ManageTeamComponent {
  avatarColor: string;
  canChangePeriod: boolean;
  isUnassigned: boolean;
  @Input() team: any;

  constructor(
    private configService: ConfigService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private updateWorkgroupService: UpdateWorkgroupService
  ) {}

  ngOnInit() {
    this.avatarColor = getAvatarColorForWorkgroupId(this.team.workgroupId);
    this.isUnassigned = this.team.workgroupId == null;
    this.canChangePeriod =
      this.configService.getPermissions().canGradeStudentWork &&
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

  protected drop(event: CdkDragDrop<string[]>): void {
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

  private moveUser(event: CdkDragDrop<string[]>): void {
    this.updateWorkgroupService
      .moveMember(event.item.data.user.id, this.team.workgroupId)
      .subscribe({
        next: (workgroupId: number) => {
          const previousIndex = event.previousContainer.data.findIndex(
            (user) => user === event.item.data.user
          );
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            previousIndex,
            event.currentIndex
          );
          this.configService
            .retrieveConfig(`/api/config/classroomMonitor/${this.configService.getRunId()}`)
            .subscribe({
              next: () => {
                this.snackBar.open($localize`Moved student to Team ${workgroupId}.`);
              }
            });
        },
        error: () => {
          this.snackBar.open($localize`Error: Could not move student.`);
        }
      });
  }
}
