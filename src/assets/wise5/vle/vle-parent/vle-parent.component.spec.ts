import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { InitializeVLEService } from '../../services/initializeVLEService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../vleProjectService';
import { VLEParentComponent } from './vle-parent.component';
import { provideHttpClient } from '@angular/common/http';
import { MockProvider, MockProviders } from 'ng-mocks';

let component: VLEParentComponent;
let fixture: ComponentFixture<VLEParentComponent>;
let initializeVLEService: InitializeVLEService;
let dataService: StudentDataService;
let projectService: VLEProjectService;
const nodeId1: string = 'node1';
let router: Router;
const runId1: string = '1';
describe('VLEParentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VLEParentComponent],
      providers: [
        MockProviders(StudentDataService, VLEProjectService),
        MockProvider(InitializeVLEService, {
          initialized$: new BehaviorSubject<boolean>(false).asObservable(),
          initializePreview: (unitId: string) => Promise.resolve(),
          initializeStudent: (unitId: string) => Promise.resolve()
        }),
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(VLEParentComponent);
    component = fixture.componentInstance;
    initializeVLEService = TestBed.inject(InitializeVLEService);
    dataService = TestBed.inject(StudentDataService);
    projectService = TestBed.inject(VLEProjectService);
    router = TestBed.inject(Router);
  });
  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    initialize();
    previewConstraints();
    initializeStudent();
  });
}

function initialize() {
  it('preview route should initialize preview', () => {
    setRouterUrl(`/preview/unit/${runId1}`);
    expectInitialize('initializePreview', runId1);
  });
  it('student route should initialize student', () => {
    setRouterUrl(`/student/unit/${runId1}`);
    expectInitialize('initializeStudent', runId1);
  });
}

function expectInitialize(functionName: any, runId: string): void {
  const initPreviewSpy = spyOn(initializeVLEService, functionName);
  fixture.detectChanges();
  expect(initPreviewSpy).toHaveBeenCalledWith(runId);
}

function previewConstraints() {
  it('should set the starting node id when constraints are enabled', () => {
    setRouterUrl(`/preview/unit/${runId1}/${nodeId1}`);
    expectSetCurrentNode(nodeId1, true);
  });
  it('should set the starting node id when constraints are disabled', () => {
    setRouterUrl(`/preview/unit/${runId1}/${nodeId1}?constraints=false`);
    expectSetCurrentNode(nodeId1, true);
  });
}

function initializeStudent() {
  it('should set the starting node id when there is no last NodeEntered event', () => {
    setRouterUrl(`/unit/${runId1}`);
    spyOn(dataService, 'getEvents').and.returnValue([]);
    spyOn(projectService, 'getStartNodeId').and.returnValue('node2');
    expectSetCurrentNode('node2', false);
  });
  it('should set the starting node id when there is last NodeEntered event', () => {
    setRouterUrl(`/unit/${runId1}`);
    spyOn(dataService, 'getEvents').and.returnValue([{ event: 'nodeEntered', nodeId: 'node32' }]);
    spyOn(projectService, 'getNodeById').and.returnValue({});
    spyOn(projectService, 'isActive').and.returnValue(true);
    expectSetCurrentNode('node32', false);
  });
}

function setRouterUrl(url: string): void {
  spyOnProperty(router, 'url', 'get').and.returnValue(url);
}

function expectSetCurrentNode(nodeId: string, isPreview: boolean) {
  spyOn(initializeVLEService, isPreview ? 'initializePreview' : 'initializeStudent').and.callFake(
    () => {
      setInitialized(true);
      return Promise.resolve();
    }
  );

  const setCurrentNodeIdSpy = spyOn(TestBed.inject(StudentDataService), 'setCurrentNodeByNodeId');
  spyOn(router, 'navigate').and.callFake(() => {
    return Promise.resolve(true);
  });
  component.ngOnInit();
  expect(setCurrentNodeIdSpy).toHaveBeenCalledWith(nodeId);
}

function setInitialized(value: boolean): void {
  const intializedSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(value);
  TestBed.inject(InitializeVLEService).initialized$ = intializedSource.asObservable();
  fixture.detectChanges();
}
