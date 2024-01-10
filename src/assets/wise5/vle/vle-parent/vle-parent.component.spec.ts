import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { InitializeVLEService } from '../../services/initializeVLEService';
import { PauseScreenService } from '../../services/pauseScreenService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { StudentNotificationService } from '../../services/studentNotificationService';
import { VLEProjectService } from '../vleProjectService';
import { VLEParentComponent } from './vle-parent.component';

let component: VLEParentComponent;
let fixture: ComponentFixture<VLEParentComponent>;
let initializeVLEService: InitializeVLEService;
const nodeId1: string = 'node1';
let router: Router;
const runId1: string = '1';

describe('VLEParentComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [VLEParentComponent],
      providers: [
        InitializeVLEService,
        PauseScreenService,
        ProjectService,
        StudentNotificationService,
        VLEProjectService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(VLEParentComponent);
    component = fixture.componentInstance;
    initializeVLEService = TestBed.inject(InitializeVLEService);
    router = TestBed.inject(Router);
  });
  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    initialize();
    previewConstraints();
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
    expectSetCurrentNode(nodeId1);
  });
  it('should set the starting node id when constraints are disabled', () => {
    setRouterUrl(`/preview/unit/${runId1}/${nodeId1}?constraints=false`);
    expectSetCurrentNode(nodeId1);
  });
}

function setRouterUrl(url: string): void {
  spyOnProperty(router, 'url', 'get').and.returnValue(url);
}

function expectSetCurrentNode(nodeId: string) {
  spyOn(initializeVLEService, 'initializePreview').and.callFake(() => {
    setInitialized(true);
    return Promise.resolve();
  });
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
