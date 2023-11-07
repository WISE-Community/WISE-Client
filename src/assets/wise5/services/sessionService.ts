'use strict';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './configService';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SessionService {
  private warningVisible: boolean = false;
  private defaultForceLogoutAfterWarningInterval: number = this.convertMinutesToSeconds(5);
  private forceLogoutAfterWarningInterval: number;
  private showWarningInterval: number;
  private checkMouseEventInterval: number;
  private lastActivityTimestamp: number;
  private exitSource: Subject<void> = new Subject<void>();
  public exit$: Observable<void> = this.exitSource.asObservable();
  private showSessionWarningSource: Subject<void> = new Subject<void>();
  public showSessionWarning$: Observable<void> = this.showSessionWarningSource.asObservable();
  private logOutSource: Subject<void> = new Subject<void>();
  public logOut$ = this.logOutSource.asObservable();

  constructor(protected http: HttpClient, protected configService: ConfigService) {}

  calculateIntervals(sessionTimeout: number): any {
    const forceLogoutAfterWarningInterval: number = Math.min(
      sessionTimeout * 0.1,
      this.defaultForceLogoutAfterWarningInterval
    );
    const showWarningInterval: number = sessionTimeout - forceLogoutAfterWarningInterval;
    return {
      showWarningInterval: showWarningInterval,
      forceLogoutAfterWarningInterval: forceLogoutAfterWarningInterval
    };
  }

  isAuthenticated(): boolean {
    return this.configService.getConfigParam('userType') != 'none';
  }

  goHome() {
    this.broadcastExit();
    window.location.href = this.isAuthenticated()
      ? `/${this.configService.getConfigParam('userType')}`
      : '/';
  }

  broadcastExit() {
    this.exitSource.next();
  }

  logOut() {
    this.broadcastExit();
    this.http.get(this.configService.getSessionLogOutURL()).subscribe(() => {
      window.location.href = '/';
    });
  }

  initializeSession() {
    const intervals: any = this.calculateIntervals(
      this.configService.getConfigParam('sessionTimeout')
    );
    this.showWarningInterval = intervals.showWarningInterval;
    this.forceLogoutAfterWarningInterval = intervals.forceLogoutAfterWarningInterval;
    this.checkMouseEventInterval = this.convertMinutesToMilliseconds(1);
    this.updateLastActivityTimestamp();
    this.startCheckMouseEvent();
  }

  startCheckMouseEvent(): void {
    setInterval(() => {
      this.checkMouseEvent();
    }, this.checkMouseEventInterval);
  }

  private convertMinutesToSeconds(minutes: number): number {
    return minutes * 60;
  }

  private convertMinutesToMilliseconds(minutes: number): number {
    return minutes * 60 * 1000;
  }

  /**
   * Note: This does not get called when the warning popup is being shown.
   */
  mouseMoved(): void {
    this.updateLastActivityTimestamp();
  }

  private updateLastActivityTimestamp(): void {
    this.lastActivityTimestamp = new Date().getTime();
  }

  checkMouseEvent() {
    if (this.isActiveWithinLastMinute()) {
      this.renewSession();
    } else {
      this.checkForLogout();
    }
  }

  checkForLogout() {
    if (this.isInactiveLongEnoughToForceLogout()) {
      this.checkIfSessionIsActive().subscribe((isSessionActive) => {
        if (!isSessionActive) {
          this.forceLogOut();
        }
      });
    } else if (this.isInactiveLongEnoughToWarn() && !this.isShowingWarning()) {
      this.showWarning();
    }
  }

  isActiveWithinLastMinute(): boolean {
    return new Date().getTime() - this.lastActivityTimestamp < this.convertMinutesToMilliseconds(1);
  }

  isInactiveLongEnoughToForceLogout(): boolean {
    return (
      this.getInactiveTimeInSeconds() >=
      this.showWarningInterval + this.forceLogoutAfterWarningInterval
    );
  }

  isInactiveLongEnoughToWarn(): boolean {
    return this.getInactiveTimeInSeconds() >= this.showWarningInterval;
  }

  isShowingWarning(): boolean {
    return this.warningVisible;
  }

  private getInactiveTimeInSeconds(): number {
    return Math.floor(this.getInactiveTimeInMilliseconds() / 1000);
  }

  private getInactiveTimeInMilliseconds(): number {
    return new Date().getTime() - this.lastActivityTimestamp;
  }

  forceLogOut(): void {
    this.logOutSource.next();
  }

  showWarning(): void {
    this.warningVisible = true;
    this.broadcastShowSessionWarning();
  }

  private broadcastShowSessionWarning(): void {
    this.showSessionWarningSource.next();
  }

  closeWarningAndRenewSession(): void {
    this.warningVisible = false;
    this.updateLastActivityTimestamp();
    this.renewSession();
  }

  checkIfSessionIsActive(): Observable<boolean> {
    return this.http.get<boolean>(this.configService.getConfigParam('renewSessionURL'));
  }

  renewSession(): void {
    this.checkIfSessionIsActive().subscribe((isSessionActive) => {
      if (!isSessionActive) {
        this.logOut();
      }
    });
  }
}
