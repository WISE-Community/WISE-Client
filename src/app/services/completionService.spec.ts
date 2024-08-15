import { TestBed } from '@angular/core/testing';
import { CompletionService } from '../../assets/wise5/services/completionService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentContent } from '../../assets/wise5/common/ComponentContent';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let dataService: StudentDataService;
let projectService: ProjectService;
let service: CompletionService;
const component1 = { id: 'component1', type: 'OpenResponse' } as ComponentContent;
const node1 = { id: 'node1' };
const stateForComponent1 = {
  nodeId: 'node1',
  componentId: 'component1',
  studentData: { response: 'Hello World 1' }
};
describe('CompletionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
    });
    it('should return true when isCompleted is set to true in NodeStatuses', () => {
      dataService.nodeStatuses = { node1: { isCompleted: true } };
      expect(service.isCompleted('node1')).toEqual(true);
    });
    it('should return false when isCompleted is not set or is set to false in NodeStatuses', () => {
      dataService.nodeStatuses = { node1: { isCompleted: false } };
      expect(service.isCompleted('node1')).toEqual(false);
      expect(service.isCompleted('node2')).toBeFalsy();
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
