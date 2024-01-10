import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { NodeService } from '../../services/nodeService';
import { StudentDataService } from '../../services/studentDataService';
import { NodeNavigationComponent } from './node-navigation.component';

class MockNodeService {
  getNextNodeId() {}
  getPrevNodeId() {}
}

class MockStudentDataService {
  currentNodeChanged$ = of(null);
  nodeStatusesChanged$ = of(null);
}

let component: NodeNavigationComponent;
let nodeService: NodeService;
let nextNodeIdSpy;
let prevNodeIdSpy;
describe('NodeNavigationComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NodeNavigationComponent,
        { provide: NodeService, useClass: MockNodeService },
        { provide: StudentDataService, useClass: MockStudentDataService }
      ]
    });
    component = TestBed.inject(NodeNavigationComponent);
    nodeService = TestBed.inject(NodeService);
    nextNodeIdSpy = spyOn(nodeService, 'getNextNodeId');
    prevNodeIdSpy = spyOn(nodeService, 'getPrevNodeId');
  });
  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    it('should set hasNextNode and hasPrevNode based on calls to NodeService', fakeAsync(() => {
      expectHasPrevNextNodeValues(null, null, false, false);
      expectHasPrevNextNodeValues('node1', null, true, false);
      expectHasPrevNextNodeValues(null, 'node3', false, true);
      expectHasPrevNextNodeValues('node1', 'node3', true, true);
    }));
  });
}

function expectHasPrevNextNodeValues(
  prevNodeId: string,
  nextNodeId: string,
  expectedHasPrevNode: boolean,
  expectedHasNextNode: boolean
) {
  prevNodeIdSpy.and.returnValue(prevNodeId);
  nextNodeIdSpy.and.returnValue(Promise.resolve(nextNodeId));
  component.ngOnInit();
  tick(); // ensures component.hasNextNode to be set
  expect(component.hasPrevNode).toBe(expectedHasPrevNode);
  expect(prevNodeIdSpy).toHaveBeenCalled();
  expect(nextNodeIdSpy).toHaveBeenCalled();
  expect(component.hasNextNode).toBe(expectedHasNextNode);
}
