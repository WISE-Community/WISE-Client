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

@Component({
  selector: 'manage-team',
  styleUrls: ['manage-team.component.scss'],
  templateUrl: 'manage-team.component.html'
})
export class ManageTeamComponent {
  @Input() team: any;

  canChangePeriod: boolean;

  constructor(
    private dialog: MatDialog,
    private ConfigService: ConfigService,
    private UpdateWorkgroupService: UpdateWorkgroupService
  ) {}

  ngOnInit() {
    this.canChangePeriod = this.ConfigService.getPermissions().canGradeStudentWork;
  }

  changePeriod() {
    this.dialog.open(ChangeTeamPeriodDialogComponent, {
      data: this.team,
      panelClass: 'mat-dialog--md'
    });
  }

  dragEnter(event: CdkDragEnter) {
    event.container.element.nativeElement.classList.add('primary-bg');
  }

  dragExit(event: CdkDragExit) {
    event.container.element.nativeElement.classList.remove('primary-bg');
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer !== event.container) {
      this.dialog
        .open(MoveUserConfirmDialogComponent)
        .afterClosed()
        .subscribe((doMoveUser: boolean) => {
          if (doMoveUser) {
            this.moveUser(event);
          }
          event.container.element.nativeElement.classList.remove('primary-bg');
        });
    }
  }

  canDrop(drag: CdkDrag, drop: CdkDropList) {
    return drop.data.length < 3;
  }

  private moveUser(event: CdkDragDrop<string[]>) {
    const user: any = event.previousContainer.data[event.previousIndex];
    this.UpdateWorkgroupService.moveMember(
      user.id,
      event.item.data,
      this.team.workgroupId
    ).subscribe(() => {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    });
  }
}
