import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  ViewEncapsulation
} from '@angular/core';
import { Announcement } from '../domain/announcement';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatButton } from '@angular/material/button';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatButtonModule, MatIconModule],
  selector: 'app-announcement',
  styleUrl: './announcement.component.scss',
  templateUrl: './announcement.component.html'
})
export class AnnouncementComponent {
  private dialog = inject(MatDialog);

  readonly announcement = input<Announcement>(new Announcement());
  readonly dismiss = output<void>();

  protected showAnnouncementDetails(): void {
    this.dialog.open(AnnouncementDialogComponent, {
      data: this.announcement(),
      panelClass: 'dialog-md'
    });
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly data = inject<Announcement>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<AnnouncementDialogComponent>);
}
