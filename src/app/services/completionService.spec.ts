import { TestBed } from '@angular/core/testing';
import { CompletionService } from '../../assets/wise5/services/completionService';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentContent } from '../../assets/wise5/common/ComponentContent';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';

let dataService: StudentDataService;
let projectService: ProjectService;
let service: CompletionService;
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
  xit('should check a component is completed false', () => {
    const componentStates = [];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    const componentEvents = [];
    spyOn(dataService, 'getEventsByNodeIdAndComponentId').and.returnValue(componentEvents);
    const nodeEvents = [];
    spyOn(dataService, 'getEventsByNodeId').and.returnValue(nodeEvents);
    const component = { id: 'component1', type: 'OpenResponse' } as ComponentContent;
    spyOn(projectService, 'getComponent').and.returnValue(component);
    const node = { id: 'node1' };
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    expect(service.isCompleted('node1', 'component1')).toEqual(false);
  });
  xit('should check a component is completed true', () => {
    const componentStates = [{ studentData: { response: 'Hello World' } }];
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.returnValue(componentStates);
    const componentEvents = [];
    spyOn(dataService, 'getEventsByNodeIdAndComponentId').and.returnValue(componentEvents);
    const nodeEvents = [];
    spyOn(dataService, 'getEventsByNodeId').and.returnValue(nodeEvents);
    const component = { id: 'component1', type: 'OpenResponse' } as ComponentContent;
    spyOn(projectService, 'getComponent').and.returnValue(component);
    const node = { id: 'node1' };
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    expect(service.isCompleted('node1', 'component1')).toEqual(true);
  });
  xit('should check a step node is completed false', () => {
    spyOn(projectService, 'isGroupNode').and.returnValue(false);
    const node = {};
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    const components = [
      { id: 'component1', type: 'OpenResponse' },
      { id: 'component2', type: 'OpenResponse' }
    ] as ComponentContent[];
    spyOn(projectService, 'getComponents').and.returnValue(components);
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.callFake(
      (nodeId, componentId) => {
        if (nodeId === 'node1' && componentId === 'component1') {
          return [{ studentData: { response: 'Hello World' } }];
        } else if (nodeId === 'node1' && componentId === 'component2') {
          return [];
        }
      }
    );
    const componentEvents = [];
    spyOn(dataService, 'getEventsByNodeIdAndComponentId').and.returnValue(componentEvents);
    const nodeEvents = [];
    spyOn(dataService, 'getEventsByNodeId').and.returnValue(nodeEvents);
    expect(service.isCompleted('node1')).toEqual(false);
  });
  xit('should check a step node is completed true', () => {
    spyOn(projectService, 'isGroupNode').and.returnValue(false);
    const node = {};
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    const components = [
      { id: 'component1', type: 'OpenResponse' },
      { id: 'component2', type: 'OpenResponse' }
    ] as ComponentContent[];
    spyOn(projectService, 'getComponents').and.returnValue(components);
    spyOn(dataService, 'getComponentStatesByNodeIdAndComponentId').and.callFake(
      (nodeId, componentId) => {
        if (nodeId === 'node1' && componentId === 'component1') {
          return [{ studentData: { response: 'Hello World' } }];
        } else if (nodeId === 'node1' && componentId === 'component2') {
          return [{ studentData: { response: 'Hello World2' } }];
        }
      }
    );
    const componentEvents = [];
    spyOn(dataService, 'getEventsByNodeIdAndComponentId').and.returnValue(componentEvents);
    const nodeEvents = [];
    spyOn(dataService, 'getEventsByNodeId').and.returnValue(nodeEvents);
    expect(service.isCompleted('node1')).toEqual(true);
  });
  it('should check a group node is completed false', () => {
    spyOn(projectService, 'isGroupNode').and.returnValue(true);
    const node = {};
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    const nodeIds = ['node1', 'node2'];
    spyOn(projectService, 'getChildNodeIdsById').and.returnValue(nodeIds);
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
    expect(service.isCompleted('node1')).toEqual(false);
  });
  it('should check a group node is completed true', () => {
    spyOn(projectService, 'isGroupNode').and.returnValue(true);
    const node = {};
    spyOn(projectService, 'getNodeById').and.returnValue(node);
    const nodeIds = ['node1', 'node2'];
    spyOn(projectService, 'getChildNodeIdsById').and.returnValue(nodeIds);
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
    expect(service.isCompleted('node1')).toEqual(true);
  });
}
