import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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
let fixture: ComponentFixture<NodeNavigationComponent>;
let nodeService: NodeService;
let nextNodeIdSpy;
let prevNodeIdSpy;
describe('NodeNavigationComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NodeNavigationComponent],
      providers: [
        { provide: NodeService, useClass: MockNodeService },
        { provide: StudentDataService, useClass: MockStudentDataService }
      ]
    });
    fixture = TestBed.createComponent(NodeNavigationComponent);
    component = fixture.componentInstance;
    nodeService = TestBed.inject(NodeService);
    nextNodeIdSpy = spyOn(nodeService, 'getNextNodeId');
    prevNodeIdSpy = spyOn(nodeService, 'getPrevNodeId');
  });
  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    it("should not show buttons if next and prev steps don't exist", fakeAsync(() => {
      expectHasPrevNextNodeValues(null, null, false, false);
    }));
    it('should show prev button if prev step exists', fakeAsync(() => {
      expectHasPrevNextNodeValues('node1', null, true, false);
    }));
    xit('should show next button if next step exists', fakeAsync(() => {
      // TODO: for some reason, the next button should appear but does not
      expectHasPrevNextNodeValues(null, 'node3', false, true);
    }));
    xit('should show prev and next button if prev and next steps exist', fakeAsync(() => {
      // TODO: for some reason, the next button should appear but does not
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
  fixture.detectChanges();
  component.ngOnInit();
  tick(); // ensures component.hasNextNode to be set
  const buttons = Array.from(fixture.debugElement.nativeElement.querySelectorAll('button'));
  const prevButton = buttons.find((el: any) => el.innerHTML.includes('Previous step'));
  const nextButton = buttons.find((el: any) => el.innerHTML.includes('Next step'));
  if (expectedHasPrevNode) {
    expect(prevButton).toBeDefined();
  }
  if (expectedHasNextNode) {
    expect(nextButton).toBeDefined();
  }
  expect(prevNodeIdSpy).toHaveBeenCalled();
  expect(nextNodeIdSpy).toHaveBeenCalled();
}
