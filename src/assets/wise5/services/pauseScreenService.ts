import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Message } from '@stomp/stompjs';
import { DialogWithoutCloseComponent } from '../directives/dialog-without-close/dialog-without-close.component';
import { ConfigService } from './configService';
import { StompService } from './stompService';
import { StudentDataService } from './studentDataService';

@Injectable()
export class PauseScreenService {
  constructor(
    private configService: ConfigService,
    private dialog: MatDialog,
    private stompService: StompService,
    private studentDataService: StudentDataService
  ) {}

  initialize(): void {
    this.subscribeToPauseMessages();
    if (this.isPeriodPaused()) {
      this.pauseScreen();
    }
  }

  private subscribeToPauseMessages(): void {
    this.stompService.periodMessage$.subscribe((message: Message) => {
      const body = JSON.parse(message.body);
      if (body.type === 'pause') {
        this.pauseScreen();
      } else if (body.type === 'unpause') {
        this.unPauseScreen();
      }
    });
  }

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

  private isPeriodPaused(): boolean {
    const runStatus = this.studentDataService.getRunStatus();
    const periodId = this.configService.getPeriodId();
    return runStatus.periods.some((period: any) => period.periodId === periodId && period.paused);
  }
}
