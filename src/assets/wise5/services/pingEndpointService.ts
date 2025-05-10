import { Component } from '../common/Component';
import { DialogGuidanceComponent } from '../components/dialogGuidance/DialogGuidanceComponent';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpenResponseContent } from '../components/openResponse/OpenResponseContent';

@Injectable()
export class PingEndpointService {
  private pingUrl = '/api/c-rater/ping-endpoint';
  private interval: NodeJS.Timeout;
  private isPinging: boolean;
  private itemId: string = '';

  constructor(private http: HttpClient) {}

  startPinging(component: Component): void {
    const componentType = component.content.type;
    if (!this.isPinging) {
      this.findItemId(component, componentType);
      this.sendPing();
      // 295000 ms = 4min 55sec
      this.interval = setInterval(() => this.sendPing(), 295000);
      this.isPinging = true;
    }
  }

  stopPinging(): void {
    if (this.isPinging) {
      clearInterval(this.interval);
      this.isPinging = false;
    }
  }

  private sendPing(): void {
    this.http.post(this.pingUrl, { itemId: this.itemId }).subscribe(() => {});
  }

  private findItemId(component: Component, componentType: string): void {
    if (componentType === 'DialogGuidance') {
      this.itemId = (component as DialogGuidanceComponent).getItemId();
    } else if (componentType === 'OpenResponse') {
      this.itemId = (component.content as OpenResponseContent).cRater?.itemId ?? '';
    }
  }
}
