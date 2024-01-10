import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ConfigService } from '../../services/configService';
import { NodeService } from '../../services/nodeService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../services/teacherWebSocketService';
import { StepToolsComponent } from './step-tools.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const nodeId1 = 'node1';
const nodeId2 = 'node2';
const nodeId3 = 'node3';
const nodeId4 = 'node4';
const nodeId5 = 'node5';

class MockNodeService {
  goToNextNode() {
    return Promise.resolve(nodeId4);
  }

  goToNextNodeWithWork() {
    return Promise.resolve(nodeId5);
  }

  goToPrevNode() {
    return Promise.resolve(nodeId2);
  }

  goToPrevNodeWithWork() {
    return Promise.resolve(nodeId1);
  }
}

describe('StepTools', () => {
  let component: StepToolsComponent;
  let fixture: ComponentFixture<StepToolsComponent>;
  let getModeSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatSelectModule,
        NoopAnimationsModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [StepToolsComponent],
      providers: [
        ClassroomStatusService,
        { provide: NodeService, useClass: MockNodeService },
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    });
    fixture = TestBed.createComponent(StepToolsComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId3;
    getModeSpy = spyOn(TestBed.inject(ConfigService), 'getMode');
    fixture.detectChanges();
  });

  it('should go to next node when in classroom monitor', fakeAsync(() => {
    getModeSpy.and.returnValue('classroomMonitor');
    const goToNextNodeWithWorkSpy = spyOn(
      TestBed.inject(NodeService),
      'goToNextNodeWithWork'
    ).and.callThrough();
    component.goToNextNode();
    expect(goToNextNodeWithWorkSpy).toHaveBeenCalled();
    tick();
    expect(component.nodeId).toEqual(nodeId5);
  }));

  it('should go to next node when in authoring tool', fakeAsync(() => {
    getModeSpy.and.returnValue('author');
    const goToNextNodeSpy = spyOn(TestBed.inject(NodeService), 'goToNextNode').and.callThrough();
    component.goToNextNode();
    expect(goToNextNodeSpy).toHaveBeenCalled();
    tick();
    expect(component.nodeId).toEqual(nodeId4);
  }));

  it('should go to previous node when in classroom monitor', () => {
    getModeSpy.and.returnValue('classroomMonitor');
    const goToPrevNodeWithWorkSpy = spyOn(
      TestBed.inject(NodeService),
      'goToPrevNodeWithWork'
    ).and.callThrough();
    component.goToPrevNode();
    expect(goToPrevNodeWithWorkSpy).toHaveBeenCalled();
  });

  it('should go to next previous node when in authoring tool', () => {
    getModeSpy.and.returnValue('author');
    const goToPrevNodeSpy = spyOn(TestBed.inject(NodeService), 'goToPrevNode').and.callThrough();
    component.goToPrevNode();
    expect(goToPrevNodeSpy).toHaveBeenCalled();
  });
});
