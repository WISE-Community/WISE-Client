import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { MockProvider, MockProviders } from 'ng-mocks';
import { defer, delay, of, Subject, tap, throwError } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { RxStomp } from '@stomp/rx-stomp';
import { AchievementService } from '../../assets/wise5/services/achievementService';
import { ClassroomStatusService } from '../../assets/wise5/services/classroomStatusService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { NotificationService } from '../../assets/wise5/services/notificationService';
import { TeacherWebSocketService } from '../../assets/wise5/services/teacherWebSocketService';

let classroomMessage$: Subject<Message>;
let configRequestCount: number;
let configService: ConfigService;
let service: TeacherWebSocketService;

describe('TeacherWebSocketService', () => {
  beforeEach(() => {
    classroomMessage$ = new Subject<Message>();
    TestBed.configureTestingModule({
      providers: [
        MockProviders(AchievementService, ClassroomStatusService, NotificationService),
        MockProvider(ConfigService, {
          getPeriods: () => [{ periodId: 1 }],
          getRunId: () => 1
        }),
        TeacherWebSocketService
      ]
    });
    configService = TestBed.inject(ConfigService);
    service = TestBed.inject(TeacherWebSocketService);
    spyOn(service, 'initializeStomp').and.callFake(() => {
      service.rxStomp = { watch: () => classroomMessage$ } as unknown as RxStomp;
    });
    spyOn(service, 'subscribeToTeacherTopic');
    spyOn(service, 'subscribeToTeacherWorkgroupTopic');
    configRequestCount = 0;
    spyOn(configService, 'retrieveConfig').and.returnValue(
      defer(() => {
        configRequestCount++;
        return of({});
      })
    );
  });
  newWorkgroupJoinedRun();
});

function sendNewWorkgroupJoinedRun(): void {
  classroomMessage$.next({ body: JSON.stringify({ type: 'newWorkgroupJoinedRun' }) } as Message);
}

function newWorkgroupJoinedRun() {
  describe('newWorkgroupJoinedRun message', () => {
    it('should request the classroom monitor config', fakeAsync(() => {
      service.initialize();
      sendNewWorkgroupJoinedRun();
      tick(2000);
      expect(configService.retrieveConfig).toHaveBeenCalledWith('/api/config/classroomMonitor/1');
      expect(configRequestCount).toEqual(1);
    }));

    it('should request the config once for a burst of joins', fakeAsync(() => {
      service.initialize();
      for (let i = 0; i < 5; i++) {
        sendNewWorkgroupJoinedRun();
        tick(100);
      }
      tick(10000);
      expect(configRequestCount).toEqual(1);
    }));

    it('should keep requesting the config while joins keep arriving', fakeAsync(() => {
      service.initialize();
      for (let i = 0; i < 10; i++) {
        sendNewWorkgroupJoinedRun();
        tick(1000);
      }
      expect(configRequestCount).toBeGreaterThanOrEqual(3);
    }));

    it('should finish slow config requests while joins keep arriving', fakeAsync(() => {
      let answered = 0;
      (configService.retrieveConfig as jasmine.Spy).and.returnValue(
        of({}).pipe(
          delay(3000),
          tap(() => answered++)
        )
      );
      service.initialize();
      for (let i = 0; i < 12; i++) {
        sendNewWorkgroupJoinedRun();
        tick(1000);
      }
      expect(answered).toBeGreaterThanOrEqual(2);
      flush();
    }));

    it('should keep listening after a config request fails', fakeAsync(() => {
      (configService.retrieveConfig as jasmine.Spy).and.returnValues(
        defer(() => {
          configRequestCount++;
          return throwError(() => new Error('network error'));
        }),
        defer(() => {
          configRequestCount++;
          return of({});
        })
      );
      service.initialize();
      sendNewWorkgroupJoinedRun();
      tick(2000);
      sendNewWorkgroupJoinedRun();
      tick(2000);
      expect(configRequestCount).toEqual(2);
    }));

    it('should keep one request pipeline when initialized again', fakeAsync(() => {
      service.initialize();
      service.initialize();
      sendNewWorkgroupJoinedRun();
      tick(2000);
      expect(configRequestCount).toEqual(1);
    }));
  });
}
