import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable()
export class AccessLinkService {
  constructor(private configService: ConfigService) {}

  getAccessLinks(runCode: string, periods: string[]): string[] {
    const host = this.configService.getWISEHostname() + this.configService.getContextPath();
    const linkBase = `${host}/run-survey/${runCode}-`;
    return periods.map((period) => linkBase + period);
  }

  getPeriodFromAccessLink(link: string): string {
    return link.slice(link.lastIndexOf('-') + 1);
  }
}
