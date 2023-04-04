import { TestBed } from '@angular/core/testing';
import { CompletionService } from '../../assets/wise5/services/completionService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentContent } from '../../assets/wise5/common/ComponentContent';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';

let dataService: StudentDataService;
let projectService: ProjectService;
let service: CompletionService;
const component1 = { id: 'component1', type: 'OpenResponse' } as ComponentContent;
const component2 = { id: 'component2', type: 'OpenResponse' } as ComponentContent;
const components = [component1, component2] as ComponentContent[];
const node1 = { id: 'node1' };
const stateForComponent1 = {
  nodeId: 'node1',
  componentId: 'component1',
  studentData: { response: 'Hello World 1' }
};
const stateForComponent2 = {
  nodeId: 'node1',
  componentId: 'component2',
  studentData: { response: 'Hello World 2' }
};
describe('CompletionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule]
    });
    dataService = TestBed.inject(StudentDataService);
    projectService = TestBed.inject(ProjectService);
    service = TestBed.inject(CompletionService);
  });
  isCompleted();
});

function isCompleted() {
  describe('isCompleted()', () => {
    isCompleted_Component();
    isCompleted_Step();
    isCompleted_Group();
  });
}

function isCompleted_Component() {
  describe('Component', () => {
    beforeEach(() => {
      spyOn(projectService, 'getComponent').and.returnValue(component1);
      spyOn(projectService, 'getNodeById').and.returnValue(node1);
    });
    it('should return false when there is no component state', () => {
      dataService.studentData.componentStates = [];
      expect(service.isCompleted('node1', 'component1')).toEqual(false);
    });
    it('should return true when there is a completed component state', () => {
      dataService.studentData.componentStates = [stateForComponent1];
      expect(service.isCompleted('node1', 'component1')).toEqual(true);
    });
  });
}

function isCompleted_Step() {
  describe('Step', () => {
    beforeEach(() => {
      spyOn(projectService, 'isGroupNode').and.returnValue(false);
      spyOn(projectService, 'getNodeById').and.returnValue(node1);
      spyOn(projectService, 'getComponents').and.returnValue(components);
    });
    it('should return false when not all components are completed', () => {
      dataService.studentData.componentStates = [stateForComponent1];
      expect(service.isCompleted('node1')).toEqual(false);
    });
    it('should return true when all the components in the step are completed', () => {
      dataService.studentData.componentStates = [stateForComponent1, stateForComponent2];
      expect(service.isCompleted('node1')).toEqual(true);
    });
  });
}

function isCompleted_Group() {
  describe('Group', () => {
    beforeEach(() => {
      spyOn(projectService, 'isGroupNode').and.returnValue(true);
      spyOn(projectService, 'getNodeById').and.returnValue(node1);
      spyOn(projectService, 'getChildNodeIdsById').and.returnValue(['node1', 'node2']);
    });
    it('should return false when not all nodes in the group are completed', () => {
      dataService.nodeStatuses = {
        node1: {
          isVisible: true,
          isCompleted: true
        },
        node2: {
          isVisible: true,
          isCompleted: false
        }
      };
      expect(service.isCompleted('group1')).toEqual(false);
    });
    it('should return true when all the nodes in the group are completed', () => {
      dataService.nodeStatuses = {
        node1: {
          isVisible: true,
          isCompleted: true
        },
        node2: {
          isVisible: true,
          isCompleted: true
        }
      };
      expect(service.isCompleted('group1')).toEqual(true);
    });
  });
}
