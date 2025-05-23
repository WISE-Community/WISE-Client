import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LogOutService {
  private logOutUrl: string;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) {}

  async logOut(): Promise<void> {
    if (!this.logOutUrl) {
      await this.retrieveLogOutUrl();
    }
    this.http.get(this.logOutUrl).subscribe(() => {
      window.location.href = '/';
    });
  }

  private async retrieveLogOutUrl(): Promise<void> {
    this.configService.getConfig().subscribe((config) => {
      this.logOutUrl = config.logOutURL;
    });
  }
}
