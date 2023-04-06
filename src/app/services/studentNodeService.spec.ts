import { TestBed } from '@angular/core/testing';
import { StudentNodeService } from '../../assets/wise5/services/studentNodeService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NodeStatusService } from '../../assets/wise5/services/nodeStatusService';
import { DataService } from './data.service';

let dataService: DataService;
let nodeStatusService: NodeStatusService;
let service: StudentNodeService;
describe('StudentNodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule]
    });
    dataService = TestBed.inject(DataService);
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
  describe('is visible', () => {
    it('should call StudentDataService to set current node', () => {
      expectFunctionCall(true, 'setCurrentNodeByNodeId');
    });
  });
}

function setCurrentNode_isNotVisitable_nodeClickLocked() {
  describe('is not visible', () => {
    it('should call StudentDataService to lock node', () => {
      expectFunctionCall(false, 'nodeClickLocked');
    });
  });
}

function expectFunctionCall(
  isVisitable: boolean,
  expectedFunction: 'setCurrentNodeByNodeId' | 'nodeClickLocked'
) {
  spyOn(nodeStatusService, 'getNodeStatusByNodeId').and.returnValue({ isVisitable: isVisitable });
  const spy = spyOn(dataService, expectedFunction);
  service.setCurrentNode('node1');
  expect(spy).toHaveBeenCalledWith('node1');
}
