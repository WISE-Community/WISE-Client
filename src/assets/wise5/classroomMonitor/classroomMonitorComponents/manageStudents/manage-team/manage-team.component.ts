import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CdkDropList,
  DragDropModule,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { ChangeTeamPeriodDialogComponent } from '../change-team-period-dialog/change-team-period-dialog.component';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ConfigService } from '../../../../services/configService';
import { getAvatarColorForWorkgroupId } from '../../../../common/workgroup/workgroup';
import { ManageUserComponent } from '../manage-user/manage-user.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoveUserConfirmDialogComponent } from '../move-user-confirm-dialog/move-user-confirm-dialog.component';
import { UpdateWorkgroupService } from '../../../../../../app/services/updateWorkgroupService';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  imports: [CommonModule, DragDropModule, ManageUserComponent, MatCardModule, MatIconModule],
  selector: 'manage-team',
  styleUrl: 'manage-team.component.scss',
  templateUrl: 'manage-team.component.html'
})
export class ManageTeamComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private configService = inject(ConfigService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private updateWorkgroupService = inject(UpdateWorkgroupService);

  protected avatarColor: string;
  protected canGradeStudentWork: boolean;
  protected isUnassigned: boolean;
  protected lgScreen: boolean;
  protected mdScreen: boolean;
  @Input() team: any;

  ngOnInit(): void {
    this.breakpointObserver.observe(['(min-width: 48rem)']).subscribe((result) => {
      this.mdScreen = result.matches;
    });
    this.breakpointObserver.observe(['(min-width: 64rem)']).subscribe((result) => {
      this.lgScreen = result.matches;
    });
    this.avatarColor = getAvatarColorForWorkgroupId(this.team.workgroupId);
    this.canGradeStudentWork = this.configService.getPermissions().canGradeStudentWork;
    this.isUnassigned = this.team.workgroupId == null;
  }

  protected changePeriod(event: Event): void {
    event.preventDefault();
    this.dialog.open(ChangeTeamPeriodDialogComponent, {
      data: this.team,
      panelClass: 'dialog-sm'
    });
  }

  protected dragEnter(event: CdkDragEnter): void {
    event.container.element.nativeElement.classList.add('primary-bg');
  }

  protected dragExit(event: CdkDragExit): void {
    event.container.element.nativeElement.classList.remove('primary-bg');
  }

  protected canDrop(drag: CdkDrag, drop: CdkDropList): boolean {
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

  protected removeUser(user: any): void {
    this.team.users.splice(this.team.users.indexOf(user), 1);
  }
}
