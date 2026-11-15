'use strict';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './configService';
import { map, Observable, Subject } from 'rxjs';

export type SessionState = 'active' | 'ended' | 'closed' | 'unknown';

const EXIT_SAVE_TIMEOUT_MILLISECONDS = 10000;

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
  private sessionActive: boolean = true;
  private exitSavers = new Set<() => Promise<unknown>>();
  private leavingClosedSite: boolean = false;

  constructor(
    protected http: HttpClient,
    protected configService: ConfigService
  ) {}

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
      this.sessionActive = false;
      window.location.href = '/';
    });
  }

  logOutWithoutHomeRedirect(): Observable<boolean> {
    this.broadcastExit();
    return this.http
      .get(this.configService.getSessionLogOutURL())
      .pipe(map(() => (this.sessionActive = false)));
  }

  isSessionActive(): boolean {
    return this.sessionActive;
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
  userIsActive(): void {
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

  checkForLogout(): void {
    if (this.isInactiveLongEnoughToForceLogout()) {
      this.checkSession().subscribe((state) => {
        if (state === 'closed') {
          this.leaveClosedSite();
          return;
        }
        this.sessionActive = state !== 'ended';
        if (state === 'ended') {
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

  checkSession(): Observable<SessionState> {
    return this.http
      .get(this.configService.getConfigParam('renewSessionURL'), { responseType: 'text' })
      .pipe(
        map((answer: string): SessionState => {
          switch ((answer ?? '').trim()) {
            case 'true':
              return 'active';
            case 'false':
              return 'ended';
            case 'requestLogout':
              return 'closed';
            default:
              return 'unknown';
          }
        })
      );
  }

  renewSession(): void {
    this.checkSession().subscribe((state) => {
      if (state === 'closed') {
        this.leaveClosedSite();
      } else if (state === 'ended') {
        this.logOut();
      }
    });
  }

  /**
   * Registers work to save before the user is signed out because sign-in has been disabled.
   * @return a function that unregisters it
   */
  registerExitSaver(save: () => Promise<unknown>): () => void {
    this.exitSavers.add(save);
    return () => this.exitSavers.delete(save);
  }

  /**
   * The session is still valid when sign-in is disabled, so unsaved work can be saved before
   * signing out. If signing out fails, the next renewal tries again, because the sign-in page would
   * send a user whose session is still valid back to where they were.
   */
  private leaveClosedSite(): void {
    if (this.leavingClosedSite) {
      return;
    }
    this.leavingClosedSite = true;
    const saves = Promise.allSettled(
      [...this.exitSavers].map((save) => Promise.resolve().then(save))
    );
    let timer: ReturnType<typeof setTimeout>;
    const timeout = new Promise(
      (resolve) => (timer = setTimeout(resolve, EXIT_SAVE_TIMEOUT_MILLISECONDS))
    );
    Promise.race([saves, timeout]).then(() => {
      clearTimeout(timer);
      this.logOutWithoutHomeRedirect().subscribe({
        next: () => this.navigateTo('/login?loginDisabled=true'),
        error: () => (this.leavingClosedSite = false)
      });
    });
  }

  protected navigateTo(url: string): void {
    window.location.href = url;
  }
}
