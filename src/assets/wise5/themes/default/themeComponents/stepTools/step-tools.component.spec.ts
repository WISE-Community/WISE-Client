import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { UpgradeModule } from '@angular/upgrade/static';
import { NodeIconComponent } from '../../../../classroomMonitor/classroomMonitorComponents/shared/nodeIcon/node-icon.component';
import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { NodeService } from '../../../../services/nodeService';
import { ProjectService } from '../../../../services/projectService';
import { SessionService } from '../../../../services/sessionService';
import { StudentDataService } from '../../../../services/studentDataService';
import { TagService } from '../../../../services/tagService';
import { UtilService } from '../../../../services/utilService';
import { NodeStatusIcon } from '../nodeStatusIcon/node-status-icon.component';

import { StepToolsComponent } from './step-tools.component';

const nodeId1 = 'node1';
const nodeId2 = 'node2';
const nodeStatus1 = { icon: '', isCompleted: true };
const nodeStatus2 = { icon: '', isCompleted: false };
let getCurrentNodeIdSpy;

class MockNodeService {
  getPrevNodeId() {
    return '';
  }
  getNextNodeId() {
    return Promise.resolve('');
  }
}

describe('StepToolsComponent', () => {
  let component: StepToolsComponent;
  let fixture: ComponentFixture<StepToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatSelectModule,
        UpgradeModule
      ],
      declarations: [NodeIconComponent, NodeStatusIcon, StepToolsComponent],
      providers: [
        AnnotationService,
        ConfigService,
        { provide: NodeService, useClass: MockNodeService },
        ProjectService,
        SessionService,
        StudentDataService,
        TagService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepToolsComponent);
    getCurrentNodeIdSpy = spyOn(TestBed.inject(StudentDataService), 'getCurrentNodeId');
    getCurrentNodeIdSpy.and.returnValue(nodeId1);
    spyOn(TestBed.inject(StudentDataService), 'getNodeStatuses').and.returnValue({
      node1: nodeStatus1,
      node2: nodeStatus2
    });
    spyOn(TestBed.inject(ProjectService), 'nodeHasWork').and.returnValue(true);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should calculate node ids', () => {
    expect(component.nodeIds).toEqual([]);
    TestBed.inject(ProjectService).idToOrder = {
      group0: { order: 0 },
      node1: { order: 1 },
      node2: { order: 2 }
    };
    component.calculateNodeIds();
    expect(component.nodeIds).toEqual(['node1', 'node2']);
  });

  it('should update model', () => {
    expect(component.nodeId).toEqual(nodeId1);
    expect(component.nodeStatus).toEqual(nodeStatus1);
    getCurrentNodeIdSpy.and.returnValue(nodeId2);
    component.updateModel();
    expect(component.nodeId).toEqual(nodeId2);
    expect(component.nodeStatus).toEqual(nodeStatus2);
  });
});
