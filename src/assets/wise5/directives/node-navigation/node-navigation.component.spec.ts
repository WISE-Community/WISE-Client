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
    it('should show next button if next step exists', fakeAsync(() => {
      expectHasPrevNextNodeValues(null, 'node3', false, true);
    }));
    it('should only show next button if showPrevNodeNav is false and next and previous exist', fakeAsync(() => {
      expectHasPrevNextNodeValues('node1', 'node3', false, true);
    }));
    it('should show prev button if prev step exists and showPrevNodeNav is true', fakeAsync(() => {
      component.showPrevNodeNav = true;
      expectHasPrevNextNodeValues('node1', null, true, false);
    }));
    it('should show prev and next buttons if prev and next steps exist and showPrevNodeNav is true', fakeAsync(() => {
      component.showPrevNodeNav = true;
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
  tick(); // ensures component.hasNextNode to be set
  fixture.detectChanges();
  const buttons = Array.from(fixture.debugElement.nativeElement.querySelectorAll('button'));
  const prevButton = buttons.find((el: any) => el.innerHTML.includes('Previous step'));
  const nextButton = buttons.find((el: any) => el.innerHTML.includes('Next step'));
  if (expectedHasPrevNode) {
    expect(prevButton).toBeDefined();
  } else {
    expect(prevButton).toBeUndefined();
  }
  if (expectedHasNextNode) {
    expect(nextButton).toBeDefined();
  } else {
    expect(nextButton).toBeUndefined();
  }
  expect(prevNodeIdSpy).toHaveBeenCalled();
  expect(nextNodeIdSpy).toHaveBeenCalled();
}
