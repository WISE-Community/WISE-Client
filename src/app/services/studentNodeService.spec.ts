import { TestBed } from '@angular/core/testing';
import { StudentNodeService } from '../../assets/wise5/services/studentNodeService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NodeStatusService } from '../../assets/wise5/services/nodeStatusService';
import { DataService } from './data.service';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let dataService: DataService;
let dialog: MatDialog;
const nodeId2 = 'node2';
let nodeStatusService: NodeStatusService;
let projectService: ProjectService;
let service: StudentNodeService;

describe('StudentNodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    dataService = TestBed.inject(DataService);
    dialog = TestBed.inject(MatDialog);
    service = TestBed.inject(StudentNodeService);
    nodeStatusService = TestBed.inject(NodeStatusService);
    projectService = TestBed.inject(ProjectService);
  });
  setCurrentNode();
  getNextNodeId();
});

function setCurrentNode() {
  describe('setCurrentNode()', () => {
    setCurrentNode_isVisitable_setCurrentNode();
    setCurrentNode_isNotVisitable_nodeClickLocked();
  });
}

function setCurrentNode_isVisitable_setCurrentNode() {
  describe('node is visitable', () => {
    it('should call StudentDataService to set current node', () => {
      spyOnIsVisitable(true);
      const spy = spyOn(dataService, 'setCurrentNodeByNodeId');
      service.setCurrentNode('node1');
      expect(spy).toHaveBeenCalledWith('node1');
    });
  });
}

function setCurrentNode_isNotVisitable_nodeClickLocked() {
  describe('node is not visitable', () => {
    it('should show node locked dialog', () => {
      spyOnIsVisitable(false);
      const spy = spyOn(dialog, 'open');
      service.setCurrentNode('node1');
      expect(spy).toHaveBeenCalled();
    });
  });
}

function spyOnIsVisitable(isVisitable: boolean) {
  spyOn(nodeStatusService, 'getNodeStatusByNodeId').and.returnValue({
    isVisitable: isVisitable
  });
}

function getNextNodeId() {
  describe('getNextNodeId()', () => {
    getNextNodeId_currentNodeHasTransition_getsNodeFromTransition();
    getNextNodeId_previouslyBranched_getsNodeFromPreviousBranchPathTaken();
  });
}

function getNextNodeId_previouslyBranched_getsNodeFromPreviousBranchPathTaken() {
  describe('has previous branch path taken', () => {
    it('gets the node id from the previous branch path taken', async () => {
      spyOn(dataService, 'getBranchPathTakenEventsByNodeId').and.returnValue([
        { data: { toNodeId: nodeId2 } }
      ]);
      expect(await service.getNextNodeId()).toEqual(nodeId2);
    });
  });
}

function getNextNodeId_currentNodeHasTransition_getsNodeFromTransition() {
  describe('current node has a transition', () => {
    it('gets the node id from the transition', async () => {
      spyOn(projectService, 'getTransitionLogicByFromNodeId').and.returnValue({
        transitions: [{ to: nodeId2 }]
      });
      expect(await service.getNextNodeId()).toEqual(nodeId2);
    });
  });
}
