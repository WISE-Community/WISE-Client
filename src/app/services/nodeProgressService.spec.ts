import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NodeProgressService } from '../../assets/wise5/services/nodeProgressService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let projectService: ProjectService;
let service: NodeProgressService;
describe('NodeProgressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    projectService = TestBed.inject(ProjectService);
    service = TestBed.inject(NodeProgressService);
  });
  getNodeProgress();
});

function getNodeProgress() {
  describe('getNodeProgress()', () => {
    beforeEach(() => {
      spyOn(projectService, 'isGroupNode').and.callFake((nodeId) => {
        return nodeId.startsWith('group');
      });
      spyOn(projectService, 'nodeHasWork').and.returnValue(true);
    });
    getNodeProgress_childStepNodes_returnProgress();
    getNodeProgress_childGroupNodes_returnProgress();
  });
}

function getNodeProgress_childStepNodes_returnProgress() {
  it('should return progress with child step nodes', () => {
    const nodeStatuses = {
      node1: { nodeId: 'node1', isVisible: true, isCompleted: true },
      node2: { nodeId: 'node2', isVisible: true, isCompleted: false }
    };
    spyOn(projectService, 'getChildNodeIdsById').and.returnValue(['node1', 'node2']);
    expect(service.getNodeProgress('group1', nodeStatuses)).toEqual({
      completedItems: 1,
      completedItemsWithWork: 1,
      completionPct: 50,
      completionPctWithWork: 50,
      totalItems: 2,
      totalItemsWithWork: 2
    });
  });
}

function getNodeProgress_childGroupNodes_returnProgress() {
  it('should return progress with child group nodes', () => {
    const nodeStatuses = {
      group1: {
        nodeId: 'group1',
        progress: {
          completedItems: 1,
          totalItems: 1,
          completedItemsWithWork: 1,
          totalItemsWithWork: 1
        }
      },
      group2: {
        nodeId: 'group2',
        progress: {
          completedItems: 2,
          totalItems: 2,
          completedItemsWithWork: 2,
          totalItemsWithWork: 2
        }
      }
    };
    spyOn(projectService, 'getChildNodeIdsById').and.returnValue(['group1', 'group2']);
    expect(service.getNodeProgress('group0', nodeStatuses)).toEqual({
      completedItems: 3,
      completedItemsWithWork: 3,
      completionPct: 100,
      completionPctWithWork: 100,
      totalItems: 3,
      totalItemsWithWork: 3
    });
  });
}
