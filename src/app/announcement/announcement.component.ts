import { Component, EventEmitter, Input, Output, ViewEncapsulation, Inject } from '@angular/core';
import { Announcement } from '../domain/announcement';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  selector: 'app-announcement',
  styleUrl: './announcement.component.scss',
  templateUrl: './announcement.component.html'
})
export class AnnouncementComponent {
  @Input() announcement: Announcement = new Announcement();
  @Output() dismiss: EventEmitter<void> = new EventEmitter<void>();

  constructor(public dialog: MatDialog) {}

  protected showAnnouncementDetails(): void {
    this.dialog.open(AnnouncementDialogComponent, {
      data: this.announcement,
      panelClass: 'dialog-md'
    });
  }
}

@Component({
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  selector: 'announcement-dialog',
  templateUrl: 'announcement-dialog.component.html'
})
export class AnnouncementDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Announcement
  ) {}
}
