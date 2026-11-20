import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MockProvider, MockProviders } from 'ng-mocks';
import { defer, of, Subject, throwError } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { NotebookService } from '../../assets/wise5/services/notebookService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StompService } from '../../assets/wise5/services/stompService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { StudentNodeService } from '../../assets/wise5/services/studentNodeService';
import { StudentWebSocketService } from '../../assets/wise5/services/studentWebSocketService';
import { TagService } from '../../assets/wise5/services/tagService';

let configRequestCount: number;
let configService: ConfigService;
let periodMessage$: Subject<Message>;
let service: StudentWebSocketService;

describe('StudentWebSocketService', () => {
  beforeEach(() => {
    periodMessage$ = new Subject<Message>();
    TestBed.configureTestingModule({
      providers: [
        MockProviders(
          AnnotationService,
          NotebookService,
          ProjectService,
          StudentDataService,
          StudentNodeService,
          TagService
        ),
        MockProvider(ConfigService, { getRunId: () => 1 }),
        MockProvider(StompService, {
          periodMessage$: periodMessage$,
          workgroupMessage$: new Subject<Message>()
        }),
        StudentWebSocketService
      ]
    });
    configService = TestBed.inject(ConfigService);
    service = TestBed.inject(StudentWebSocketService);
    configRequestCount = 0;
    spyOn(configService, 'retrieveConfig').and.returnValue(
      defer(() => {
        configRequestCount++;
        return of({});
      })
    );
    spyOn(Math, 'random').and.returnValue(0);
  });
  newWorkgroupJoinedRun();
});

function sendNewWorkgroupJoinedRun(): void {
  periodMessage$.next({ body: JSON.stringify({ type: 'newWorkgroupJoinedRun' }) } as Message);
}

function newWorkgroupJoinedRun() {
  describe('newWorkgroupJoinedRun message', () => {
    it('should request the student run config', fakeAsync(() => {
      service.initialize();
      sendNewWorkgroupJoinedRun();
      tick(2000);
      expect(configService.retrieveConfig).toHaveBeenCalledWith('/api/config/studentRun/1');
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
