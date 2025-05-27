import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable()
export class AccessLinkService {
  constructor(private configService: ConfigService) {}

  getAccessLinks(runCode: string, periods: string[]) {
    const linkBase = `${this.configService.getContextPath()}/api/survey/launch/${runCode}-`;
    return periods.map((period) => linkBase + period.replaceAll(' ', '++'));
  }

  getPeriodFromAccessLink(link: string): string {
    return link.slice(link.indexOf('-') + 1).replaceAll('++', ' ');
  }
}
