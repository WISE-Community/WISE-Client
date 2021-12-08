import { CdkDragDrop, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';
import { Directive, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeerGroupMoveWorkgroupConfirmDialogComponent } from '../peer-group-move-workgroup-confirm-dialog/peer-group-move-workgroup-confirm-dialog.component';

@Directive()
export abstract class PeerGroupWorkgroupsContainerComponent implements OnInit {
  @Output()
  moveWorkgroup: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected dialog: MatDialog) {}

  ngOnInit(): void {}

  dragEnter(event: CdkDragEnter) {
    this.addBackgroundColor(event);
  }

  dragExit(event: CdkDragExit) {
    this.removeBackgroundColor(event);
  }

  dropWorkgroup(event: CdkDragDrop<any>): void {
    if (event.previousContainer !== event.container) {
      this.dialog
        .open(PeerGroupMoveWorkgroupConfirmDialogComponent, {
          data: this.isFromAssignedContainer(event),
          panelClass: 'dialog-sm'
        })
        .afterClosed()
        .subscribe((isMove: boolean) => {
          if (isMove) {
            this.moveWorkgroup.emit(event);
          }
          this.removeBackgroundColor(event);
        });
    } else {
      this.removeBackgroundColor(event);
    }
  }

  isFromAssignedContainer(event: CdkDragDrop<any>): boolean {
    return event.previousContainer.data.id !== 0;
  }

  addBackgroundColor(event: any): void {
    event.container.element.nativeElement.classList.add('primary-bg');
  }

  removeBackgroundColor(event: any): void {
    event.container.element.nativeElement.classList.remove('primary-bg');
  }
}
