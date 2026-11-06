import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { MockProvider } from 'ng-mocks';
import { defer, of, Subject, throwError } from 'rxjs';
import { AchievementService } from './achievementService';
import { ClassroomStatusService } from './classroomStatusService';
import { ConfigService } from './configService';
import { NotificationService } from './notificationService';
import { TeacherWebSocketService } from './teacherWebSocketService';

const runId = 1;
let service: TeacherWebSocketService;
let classroomStatusService: ClassroomStatusService;
let configService: ConfigService;
let topics: Map<string, Subject<any>>;

describe('TeacherWebSocketService', () => {
  beforeEach(() => {
    topics = new Map();
    spyOn(RxStomp.prototype, 'activate');
    spyOn(RxStomp.prototype, 'deactivate').and.returnValue(Promise.resolve());
    spyOn(RxStomp.prototype, 'watch').and.callFake((destination: any) => {
      const topic = new Subject<any>();
      topics.set(destination, topic);
      return topic;
    });
    TestBed.configureTestingModule({
      providers: [
        MockProvider(AchievementService),
        MockProvider(ClassroomStatusService),
        MockProvider(ConfigService, {
          getRunId: () => runId,
          getWorkgroupId: () => 10,
          getPeriods: () => [{ periodId: 1 }],
          getWebSocketURL: () => 'ws://localhost/websocket'
        }),
        MockProvider(NotificationService),
        TeacherWebSocketService
      ]
    });
    service = TestBed.inject(TeacherWebSocketService);
    classroomStatusService = TestBed.inject(ClassroomStatusService);
    configService = TestBed.inject(ConfigService);
  });
  refreshStudentStatusesOnConnect();
  reloadConfigWhenWorkgroupsJoin();
  initializeAgain();
});

function connect(): void {
  service.rxStomp.connectionState$.next(RxStompState.OPEN);
}

function sendWorkgroupJoined(): void {
  topics
    .get(`/topic/classroom/${runId}/1`)
    .next({ body: JSON.stringify({ type: 'newWorkgroupJoinedRun' }) });
}

function refreshStudentStatusesOnConnect() {
  describe('on connect', () => {
    it('refreshes student statuses and broadcasts only those that changed', () => {
      const changed = [{ workgroupId: 2 }];
      spyOn(classroomStatusService, 'refreshStudentStatuses').and.returnValue(of(changed));
      const broadcast = spyOn(classroomStatusService, 'broadcastStudentStatusReceived');
      service.initialize();
      expect(classroomStatusService.refreshStudentStatuses).not.toHaveBeenCalled();
      connect();
      expect(classroomStatusService.refreshStudentStatuses).toHaveBeenCalledTimes(1);
      expect(broadcast.calls.allArgs()).toEqual([[{ studentStatus: changed[0] }]]);
      service.rxStomp.connectionState$.next(RxStompState.CLOSED);
      connect();
      expect(classroomStatusService.refreshStudentStatuses).toHaveBeenCalledTimes(2);
    });
  });
}

function reloadConfigWhenWorkgroupsJoin() {
  describe('when workgroups join the run', () => {
    let requests: number;
    beforeEach(() => {
      requests = 0;
      spyOn(configService, 'retrieveConfig').and.callFake(() =>
        defer(() => {
          requests++;
          return requests === 1 ? throwError(() => new Error()) : of({});
        })
      );
      service.initialize();
    });

    it('reloads the config once per burst and keeps working after a failed reload', fakeAsync(() => {
      sendWorkgroupJoined();
      sendWorkgroupJoined();
      sendWorkgroupJoined();
      tick(2000);
      expect(configService.retrieveConfig).toHaveBeenCalledOnceWith(
        `/api/config/classroomMonitor/${runId}`
      );
      expect(requests).toEqual(1);
      sendWorkgroupJoined();
      tick(2000);
      expect(requests).toEqual(2);
      discardPeriodicTasks();
    }));
  });
}

function initializeAgain() {
  describe('initialize called again', () => {
    it('deactivates the previous client and stops its subscriptions', () => {
      spyOn(classroomStatusService, 'refreshStudentStatuses').and.returnValue(of([]));
      const setStudentStatus = spyOn(classroomStatusService, 'setStudentStatus');
      service.initialize();
      const firstClient = service.rxStomp;
      const firstTeacherTopic = topics.get(`/topic/teacher/${runId}`);
      service.initialize();
      expect(RxStomp.prototype.deactivate).toHaveBeenCalledTimes(1);
      expect(service.rxStomp).not.toBe(firstClient);
      expect(firstTeacherTopic.observed).toBeFalse();
      firstClient.connectionState$.next(RxStompState.OPEN);
      expect(classroomStatusService.refreshStudentStatuses).not.toHaveBeenCalled();
      expect(setStudentStatus).not.toHaveBeenCalled();
    });
  });
}
