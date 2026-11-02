import { TestBed, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
let service: SessionService;
let configService: ConfigService;

describe('SessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [ConfigService, SessionService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    configService = TestBed.inject(ConfigService);
    service = TestBed.inject(SessionService);
  });

  calculateIntervals();
  initializeSession();
  userIsActive();
  checkMouseevent();
  checkForLogout();
  renewSession();
});

function calculateIntervals() {
  describe('calculateIntervals()', () => {
    it('should calculate the warn and logout intervals when session timeout is 10 minutes', () => {
      const sessionTimeout = 600;
      const intervals = service.calculateIntervals(sessionTimeout);
      expect(intervals.showWarningInterval).toEqual(540);
      expect(intervals.forceLogoutAfterWarningInterval).toEqual(60);
    });

    it('should calculate the warn and logout intervals when session timeout is 30 minutes', () => {
      const sessionTimeout = 1800;
      const intervals = service.calculateIntervals(sessionTimeout);
      expect(intervals.showWarningInterval).toEqual(1620);
      expect(intervals.forceLogoutAfterWarningInterval).toEqual(180);
    });

    it('should calculate the warn and logout intervals when session timeout is 60 minutes', () => {
      const sessionTimeout = 3600;
      const intervals = service.calculateIntervals(sessionTimeout);
      expect(intervals.showWarningInterval).toEqual(3300);
      expect(intervals.forceLogoutAfterWarningInterval).toEqual(300);
    });
  });
}

function initializeSession() {
  describe('initializeSession()', () => {
    it('should start check mouse event when the session has a timeout', () => {
      spyOn(configService, 'getConfigParam').and.returnValue(1800);
      const startCheckMouseEventSpy = spyOn(service, 'startCheckMouseEvent');
      service.initializeSession();
      expect(startCheckMouseEventSpy).toHaveBeenCalled();
    });

    it('does not start the check timer when the session never expires', () => {
      spyOn(configService, 'getConfigParam').and.returnValue(-1);
      const startCheckMouseEventSpy = spyOn(service, 'startCheckMouseEvent');
      service.initializeSession();
      expect(startCheckMouseEventSpy).not.toHaveBeenCalled();
    });

    it('keeps a single check timer when called more than once', fakeAsync(() => {
      spyOn(configService, 'getConfigParam').and.returnValue(1800);
      const checkMouseEventSpy = spyOn(service, 'checkMouseEvent');
      service.initializeSession();
      service.initializeSession();
      tick(60000);
      expect(checkMouseEventSpy).toHaveBeenCalledTimes(1);
      discardPeriodicTasks();
    }));

    it('clears a warning left over from an earlier session', () => {
      spyOn(configService, 'getConfigParam').and.returnValue(1800);
      spyOn(service, 'startCheckMouseEvent');
      service.showWarning();
      service.initializeSession();
      expect(service.isShowingWarning()).toBeFalse();
    });
  });

  describe('stopCheckMouseEvent()', () => {
    it('stops the check timer', fakeAsync(() => {
      spyOn(configService, 'getConfigParam').and.returnValue(1800);
      const checkMouseEventSpy = spyOn(service, 'checkMouseEvent');
      service.initializeSession();
      service.stopCheckMouseEvent();
      tick(120000);
      expect(checkMouseEventSpy).not.toHaveBeenCalled();
    }));
  });
}

function userIsActive() {
  describe('userIsActive()', () => {
    it('should set last activity timestamp when the user interacts', () => {
      service.userIsActive();
      const renewSessionSpy = spyOn(service, 'renewSession');
      service.checkMouseEvent();
      expect(renewSessionSpy).toHaveBeenCalled();
    });
  });
}

function checkMouseevent() {
  describe('checkMouseEvent()', () => {
    it('should renew session if user has been active within last minute', () => {
      spyOn(service, 'isActiveWithinLastMinute').and.returnValue(true);
      const renewSessionSpy = spyOn(service, 'renewSession');
      service.checkMouseEvent();
      expect(renewSessionSpy).toHaveBeenCalled();
    });

    it('should check for logout if user has not been active within last minute', () => {
      spyOn(service, 'isActiveWithinLastMinute').and.returnValue(false);
      const checkForLogoutSpy = spyOn(service, 'checkForLogout');
      service.checkMouseEvent();
      expect(checkForLogoutSpy).toHaveBeenCalled();
    });
  });
}

function checkForLogout() {
  describe('checkForLogout()', () => {
    it('should force logout when user is inactive for long enough', () => {
      spyOn(service, 'isInactiveLongEnoughToForceLogout').and.returnValue(true);
      spyOn(service, 'checkIfSessionIsActive').and.returnValue(of(false));
      const forceLogOutSpy = spyOn(service, 'forceLogOut');
      service.checkForLogout();
      expect(forceLogOutSpy).toHaveBeenCalled();
    });

    it('should not force logout when user is inactive for long enough but session is active', () => {
      spyOn(service, 'isInactiveLongEnoughToForceLogout').and.returnValue(true);
      spyOn(service, 'checkIfSessionIsActive').and.returnValue(of(true));
      const forceLogOutSpy = spyOn(service, 'forceLogOut');
      service.checkForLogout();
      expect(forceLogOutSpy).not.toHaveBeenCalled();
    });

    it('should not force logout when the server sends an empty answer', () => {
      spyOn(service, 'isInactiveLongEnoughToForceLogout').and.returnValue(true);
      spyOn(service, 'checkIfSessionIsActive').and.returnValue(of(null));
      const forceLogOutSpy = spyOn(service, 'forceLogOut');
      service.checkForLogout();
      expect(forceLogOutSpy).not.toHaveBeenCalled();
    });

    it('should show warning when user is inactive for long enough to warn and warning is not showing', () => {
      spyOn(service, 'isInactiveLongEnoughToForceLogout').and.returnValue(false);
      spyOn(service, 'isInactiveLongEnoughToWarn').and.returnValue(true);
      spyOn(service, 'isShowingWarning').and.returnValue(false);
      const showWarningSpy = spyOn(service, 'showWarning');
      service.checkForLogout();
      expect(showWarningSpy).toHaveBeenCalled();
    });
  });
}

function renewSession() {
  describe('renewSession()', () => {
    it('should renew the session', fakeAsync(() => {
      spyOn(service, 'checkIfSessionIsActive').and.returnValue(of(true));
      const logOutSpy = spyOn(service, 'logOut');
      service.renewSession();
      tick();
      expect(logOutSpy).not.toHaveBeenCalled();
    }));

    it('should log the user out when renew session fails', fakeAsync(() => {
      spyOn(service, 'checkIfSessionIsActive').and.returnValue(of(false));
      const logOutSpy = spyOn(service, 'logOut');
      service.renewSession();
      tick();
      expect(logOutSpy).toHaveBeenCalled();
    }));

    it('keeps the user logged in when the server sends an empty answer', fakeAsync(() => {
      spyOn(service, 'checkIfSessionIsActive').and.returnValue(of(null));
      const logOutSpy = spyOn(service, 'logOut');
      service.renewSession();
      tick();
      expect(logOutSpy).not.toHaveBeenCalled();
    }));
  });
}
