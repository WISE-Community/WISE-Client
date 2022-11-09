import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { Message } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import { ConfigService } from './configService';

@Injectable()
export class StompService {
  rxStomp: RxStomp = new RxStomp();
  periodMessage$: Observable<Message>;
  workgroupMessage$: Observable<Message>;

  constructor(private configService: ConfigService) {}

  initialize(): void {
    this.initializeStomp();
    this.subscribeToMessages();
  }

  private initializeStomp(): void {
    this.rxStomp.configure({
      brokerURL: this.configService.getWebSocketURL()
    });
    this.rxStomp.activate();
  }

  private subscribeToMessages(): void {
    this.periodMessage$ = this.rxStomp.watch(
      `/topic/classroom/${this.configService.getRunId()}/${this.configService.getPeriodId()}`
    );
    this.workgroupMessage$ = this.rxStomp.watch(
      `/topic/workgroup/${this.configService.getWorkgroupId()}`
    );
  }
}
