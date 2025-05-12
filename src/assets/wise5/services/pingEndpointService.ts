import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PingEndpointService {
  private pingUrl = '/api/c-rater/ping-endpoint';
  private interval: NodeJS.Timeout;
  private isPinging: boolean;
  private pingList: Set<string> = new Set<string>();

  constructor(private http: HttpClient) {}

  addItemToPingList(itemId: string): void {
    if (this.forBerkeley(itemId)) {
      this.pingList.add(itemId);
    }
  }

  private forBerkeley(itemId: string): boolean {
    return itemId.slice(0, 9) === 'berkeley_';
  }

  removeItemFromPingList(itemId: string): void {
    this.pingList.delete(itemId);
  }

  startPinging(): void {
    if (!this.isPinging) {
      this.sendPing();
      // 295000 ms = 4min 55sec
      this.interval = setInterval(() => this.sendPing(), 295000);
      this.isPinging = true;
    }
  }

  private sendPing(): void {
    this.pingList.forEach((itemId) =>
      this.http.post(this.pingUrl, { itemId: itemId }).subscribe(() => {})
    );
  }

  stopPinging(): void {
    if (this.isPinging) {
      clearInterval(this.interval);
      this.isPinging = false;
    }
  }
}
