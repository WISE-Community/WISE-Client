import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
  serverAnswers();
  leaveClosedSite();
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
    it('should start check mouse event if not in preview mode', () => {
      spyOn(configService, 'isPreview').and.returnValue(false);
      const startCheckMouseEventSpy = spyOn(service, 'startCheckMouseEvent');
      service.initializeSession();
      expect(startCheckMouseEventSpy).toHaveBeenCalled();
    });
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
      spyOn(service, 'checkSession').and.returnValue(of('ended'));
      const forceLogOutSpy = spyOn(service, 'forceLogOut');
      service.checkForLogout();
      expect(forceLogOutSpy).toHaveBeenCalled();
    });

    it('should not force logout when user is inactive for long enough but session is active', () => {
      spyOn(service, 'isInactiveLongEnoughToForceLogout').and.returnValue(true);
      spyOn(service, 'checkSession').and.returnValue(of('active'));
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
      spyOn(service, 'checkSession').and.returnValue(of('active'));
      const logOutSpy = spyOn(service, 'logOut');
      service.renewSession();
      tick();
      expect(logOutSpy).not.toHaveBeenCalled();
    }));

    it('should log the user out when renew session fails', fakeAsync(() => {
      spyOn(service, 'checkSession').and.returnValue(of('ended'));
      const logOutSpy = spyOn(service, 'logOut');
      service.renewSession();
      tick();
      expect(logOutSpy).toHaveBeenCalled();
    }));
  });
}

function serverAnswers() {
  describe('the answer to a session renewal', () => {
    let http: HttpTestingController;
    let navigateSpy: jasmine.Spy;

    beforeEach(() => {
      spyOn(configService, 'getConfigParam').and.returnValue('/api/session/renew');
      spyOn(configService, 'getSessionLogOutURL').and.returnValue('/api/logout');
      http = TestBed.inject(HttpTestingController);
      navigateSpy = jasmine.createSpy('navigateTo');
      (service as any).navigateTo = navigateSpy;
    });

    it('should sign out when the session has ended', fakeAsync(() => {
      const logOutSpy = spyOn(service, 'logOut');
      service.renewSession();
      http.expectOne('/api/session/renew').flush('false');
      tick();
      expect(logOutSpy).toHaveBeenCalled();
    }));

    it('should sign out to the sign-in page when sign-in has been disabled', fakeAsync(() => {
      service.renewSession();
      http.expectOne('/api/session/renew').flush('requestLogout');
      tick();
      http.expectOne('/api/logout').flush({});
      expect(navigateSpy).toHaveBeenCalledWith('/login?loginDisabled=true');
    }));

    it('should keep the user signed in when the answer is empty', fakeAsync(() => {
      const logOutSpy = spyOn(service, 'logOut');
      service.renewSession();
      http.expectOne('/api/session/renew').flush('');
      tick();
      expect(logOutSpy).not.toHaveBeenCalled();
      http.verify();
    }));
  });
}

function leaveClosedSite() {
  describe('when sign-in has been closed', () => {
    let navigateSpy: jasmine.Spy;
    let logOutRequest: jasmine.Spy;

    beforeEach(() => {
      spyOn(service, 'checkSession').and.returnValue(of('closed'));
      spyOn(configService, 'getSessionLogOutURL').and.returnValue('/api/logout');
      logOutRequest = spyOn(TestBed.inject(HttpClient), 'get').and.returnValue(of({}));
      navigateSpy = spyOn<any>(service, 'navigateTo');
    });

    it('should save unsaved work before signing out', fakeAsync(() => {
      let finishSave: () => void;
      service.registerExitSaver(() => new Promise<void>((resolve) => (finishSave = resolve)));
      service.renewSession();
      tick();
      expect(logOutRequest).not.toHaveBeenCalled();
      finishSave();
      tick();
      expect(logOutRequest).toHaveBeenCalledWith('/api/logout');
      expect(navigateSpy).toHaveBeenCalledWith('/login?loginDisabled=true');
    }));

    it('should sign out anyway when a save never answers', fakeAsync(() => {
      service.registerExitSaver(() => new Promise<void>(() => {}));
      service.renewSession();
      tick(9999);
      expect(navigateSpy).not.toHaveBeenCalled();
      tick(1);
      expect(navigateSpy).toHaveBeenCalledWith('/login?loginDisabled=true');
    }));

    it('should not save work whose component has gone', fakeAsync(() => {
      const save = jasmine.createSpy('save').and.returnValue(Promise.resolve());
      const unregister = service.registerExitSaver(save);
      unregister();
      service.renewSession();
      tick();
      expect(save).not.toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/login?loginDisabled=true');
    }));

    it('should sign out even when a save throws before it starts', fakeAsync(() => {
      service.registerExitSaver(() => {
        throw new TypeError('no node status');
      });
      service.renewSession();
      tick();
      expect(navigateSpy).toHaveBeenCalledWith('/login?loginDisabled=true');
    }));

    it('should try again at the next renewal when signing out fails', fakeAsync(() => {
      logOutRequest.and.returnValues(
        throwError(() => new Error('network')),
        of({})
      );
      service.renewSession();
      tick();
      expect(navigateSpy).not.toHaveBeenCalled();
      service.renewSession();
      tick();
      expect(navigateSpy).toHaveBeenCalledWith('/login?loginDisabled=true');
    }));

    it('should leave an idle session the same way', fakeAsync(() => {
      spyOn(service, 'isInactiveLongEnoughToForceLogout').and.returnValue(true);
      const forceLogOutSpy = spyOn(service, 'forceLogOut');
      service.checkForLogout();
      tick();
      expect(forceLogOutSpy).not.toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/login?loginDisabled=true');
    }));
  });
}
