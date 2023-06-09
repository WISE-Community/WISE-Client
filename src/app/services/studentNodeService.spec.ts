import { TestBed } from '@angular/core/testing';
import { StudentNodeService } from '../../assets/wise5/services/studentNodeService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NodeStatusService } from '../../assets/wise5/services/nodeStatusService';
import { DataService } from './data.service';

let dataService: DataService;
let dialog: MatDialog;
let nodeStatusService: NodeStatusService;
let service: StudentNodeService;
describe('StudentNodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule]
    });
    dataService = TestBed.inject(DataService);
    dialog = TestBed.inject(MatDialog);
    service = TestBed.inject(StudentNodeService);
    nodeStatusService = TestBed.inject(NodeStatusService);
  });
  setCurrentNode();
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
