import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MockProvider } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { TeacherDataService } from './teacherDataService';
import { AnnotationService } from './annotationService';
import { ConfigService } from './configService';
import { TeacherProjectService } from './teacherProjectService';
import { TeacherWebSocketService } from './teacherWebSocketService';
import { Node } from '../common/Node';

describe('TeacherDataService', () => {
  let http: HttpTestingController;
  let service: TeacherDataService;
  const createNode = (nodeId: string) =>
    ({ getAllRelatedComponents: () => [{ nodeId: nodeId, componentId: 'c1' }] }) as any as Node;
  const node = createNode('node1');
  const isDataRequest = (r) => r.url === '/api/teacher/data';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeacherDataService,
        MockProvider(AnnotationService, { annotationSavedToServer$: EMPTY }),
        MockProvider(ConfigService, {
          getRunId: () => 1,
          getConfigParam: () => '/api/teacher/data'
        }),
        MockProvider(TeacherProjectService),
        MockProvider(TeacherWebSocketService, {
          newAnnotationReceived$: EMPTY,
          newStudentWorkReceived$: EMPTY
        }),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TeacherDataService);
  });

  afterEach(() => {
    http.verify();
  });

  describe('retrieveStudentDataForNode', () => {
    it('shares one request between callers asking for the same node at once', () => {
      const received = [];
      service.retrieveStudentDataForNode(node).subscribe((d) => received.push(d));
      service.retrieveStudentDataForNode(node).subscribe((d) => received.push(d));
      const requests = http.match(isDataRequest);
      expect(requests.length).toEqual(1);
      requests[0].flush({ studentWorkList: [] });
      expect(received.length).toEqual(2);
    });

    it('does not share requests for different nodes', () => {
      service.retrieveStudentDataForNode(node).subscribe();
      service.retrieveStudentDataForNode(createNode('node2')).subscribe();
      const requests = http.match(isDataRequest);
      expect(requests.length).toEqual(2);
      requests.forEach((request) => request.flush({ studentWorkList: [] }));
    });

    it('requests again once the earlier request has finished', () => {
      service.retrieveStudentDataForNode(node).subscribe();
      http.expectOne(isDataRequest).flush({ studentWorkList: [] });
      service.retrieveStudentDataForNode(node).subscribe();
      http.expectOne(isDataRequest).flush({ studentWorkList: [] });
    });

    it('requests again after a failed request', () => {
      service.retrieveStudentDataForNode(node).subscribe({ error: () => {} });
      http.expectOne(isDataRequest).flush('', { status: 500, statusText: 'Server Error' });
      service.retrieveStudentDataForNode(node).subscribe();
      http.expectOne(isDataRequest).flush({ studentWorkList: [] });
    });
  });
});
