import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PingEndpointService {
  private pingUrl = '/api/c-rater/ping';
  private intervals: Map<string, NodeJS.Timeout> = new Map<string, NodeJS.Timeout>();

  constructor(private http: HttpClient) {}

  startPinging(itemId: string): void {
    if (!this.intervalsIncludesItem(itemId) && this.forBerkeley(itemId)) {
      this.sendPing(itemId);
      // 295000 ms = 4min 55sec
      this.intervals.set(
        itemId,
        setInterval(() => this.sendPing(itemId), 295000)
      );
    }
  }

  private intervalsIncludesItem(itemId: string) {
    return [...this.intervals.keys()].includes(itemId);
  }

  private forBerkeley(itemId: string): boolean {
    return itemId.slice(0, 9) === 'berkeley_';
  }

  private sendPing(itemId): void {
    this.http.post(this.pingUrl, { itemId: itemId }).subscribe(() => {});
  }

  stopPinging(itemId: string): void {
    if (this.intervalsIncludesItem(itemId)) {
      clearInterval(this.intervals.get(itemId));
      this.intervals.delete(itemId);
    }
  }
}
