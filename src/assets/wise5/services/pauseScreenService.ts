import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogWithoutCloseComponent } from '../directives/dialog-without-close/dialog-without-close.component';

@Injectable()
export class PauseScreenService {
  constructor(private dialog: MatDialog) {}

  pauseScreen(): void {
    this.dialog.open(DialogWithoutCloseComponent, {
      data: {
        content: $localize`Your teacher has paused all the screens in the class.`,
        title: $localize`Screen Paused`
      },
      disableClose: true
    });
  }

  unPauseScreen(): void {
    this.dialog.closeAll();
  }
}
