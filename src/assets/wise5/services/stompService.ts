import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { ConfigService } from './configService';

@Injectable()
export class StompService {
  rxStomp: RxStomp;

  constructor(private configService: ConfigService) {}

  initialize() {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: this.configService.getWebSocketURL()
    });
    this.rxStomp.activate();
  }
}
