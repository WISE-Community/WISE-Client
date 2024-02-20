import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { copy } from '../../assets/wise5/common/object/object';
import { CopyNodesService } from '../../assets/wise5/services/copyNodesService';
import { DeleteNodeService } from '../../assets/wise5/services/deleteNodeService';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';

let demoProjectJSON: any;
let projectService: TeacherProjectService;
let service: DeleteNodeService;

describe('DeleteNodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      providers: [CopyNodesService, DeleteNodeService, TeacherProjectService]
    });
    demoProjectJSON = copy(demoProjectJSON_import);
    projectService = TestBed.inject(TeacherProjectService);
    service = TestBed.inject(DeleteNodeService);
  });
  shouldDeleteAStepFromTheProject();
  shouldDeleteAnInactiveStepFromTheProject();
  shouldDeleteAStepThatIsTheStartIdOfTheProject();
  shouldDeleteAStepThatIsTheLastStepOfTheProject();
  shouldDeleteAStepThatIsTheStartIdOfAnAactivityThatIsNotTheFirstActivity();
  shouldDeleteTheFirstActivityFromTheProject();
  shouldDeleteAnActivityInTheMiddleOfTheProject();
  shouldDeleteTheLastActivityFromTheProject();
  deleteActivityWithBranching();
  deleteTheLastStepInAnActivity();
  deleteAllStepsInAnActivity();
});

function shouldDeleteAStepFromTheProject() {
  it('should delete a step from the project', () => {
    projectService.setProject(demoProjectJSON);
    expect(projectService.getNodes().length).toEqual(54);
    expect(projectService.getNodeById('node5')).not.toBeNull();
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('node4'), 'node5')
    ).toBeTruthy();
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('node5'), 'node6')
    ).toBeTruthy();
    expect(projectService.getNodesWithTransitionToNodeId('node6').length).toEqual(1);
    service.deleteNode('node5');
    expect(projectService.getNodes().length).toEqual(53);
    expect(projectService.getNodeById('node5')).toBeNull();
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('node4'), 'node6')
    ).toBeTruthy();
    expect(projectService.getNodesWithTransitionToNodeId('node6').length).toEqual(1);
  });
}

function shouldDeleteAnInactiveStepFromTheProject() {
  it('should delete an inactive step from the project', () => {
    projectService.setProject(demoProjectJSON);
    const numInactiveNodes = projectService.getInactiveNodes().length;
    expect(projectService.getNodeById('node789')).not.toBeNull();
    service.deleteNode('node789');
    expect(projectService.getInactiveNodes().length).toEqual(numInactiveNodes - 1);
    expect(projectService.getNodeById('node789')).toBeNull();
  });
}

function shouldDeleteAStepThatIsTheStartIdOfTheProject() {
  it('should delete a step that is the start id of the project', () => {
    projectService.setProject(demoProjectJSON);
    expect(projectService.getStartNodeId()).toEqual('node1');
    expect(projectService.getNodesWithTransitionToNodeId('node2').length).toEqual(1);
    service.deleteNode('node1');
    expect(projectService.getStartNodeId()).toEqual('node2');
    expect(projectService.getNodesWithTransitionToNodeId('node2').length).toEqual(0);
  });
}

function shouldDeleteAStepThatIsTheLastStepOfTheProject() {
  it('should delete a step that is the last step of the project', () => {
    projectService.setProject(demoProjectJSON);
    expect(projectService.getTransitionsByFromNodeId('node802').length).toEqual(1);
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('node802'), 'node803')
    ).toBeTruthy();
    service.deleteNode('node803');
    expect(projectService.getTransitionsByFromNodeId('node802').length).toEqual(0);
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('node802'), 'node803')
    ).toBeFalsy();
  });
}

function shouldDeleteAStepThatIsTheStartIdOfAnAactivityThatIsNotTheFirstActivity() {
  it('should delete a step that is the start id of an activity that is not the first activity', () => {
    projectService.setProject(demoProjectJSON);
    expect(projectService.getGroupStartId('group2')).toEqual('node20');
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('node19'), 'node20')
    ).toBeTruthy();
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('node20'), 'node21')
    ).toBeTruthy();
    service.deleteNode('node20');
    expect(projectService.getGroupStartId('group2')).toEqual('node21');
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('node19'), 'node21')
    ).toBeTruthy();
  });
}

function shouldDeleteTheFirstActivityFromTheProject() {
  it('should delete the first activity from the project', () => {
    projectService.setProject(demoProjectJSON);
    expect(projectService.getGroupStartId('group0')).toEqual('group1');
    expect(projectService.getStartNodeId()).toEqual('node1');
    expect(projectService.getNodes().length).toEqual(54);
    expect(projectService.getNodesWithTransitionToNodeId('node20').length).toEqual(1);
    service.deleteNode('group1');
    expect(projectService.getNodeById('group1')).toBeNull();
    expect(projectService.getGroupStartId('group0')).toEqual('group2');
    expect(projectService.getStartNodeId()).toEqual('node20');
    expect(projectService.getNodes().length).toEqual(34);
    expect(projectService.getNodesWithTransitionToNodeId('node20').length).toEqual(0);
  });
}

function shouldDeleteAnActivityInTheMiddleOfTheProject() {
  it('should delete an activity that is in the middle of the project', () => {
    projectService.setProject(demoProjectJSON);
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('group2'), 'group3')
    ).toBeTruthy();
    expect(projectService.getNodes().length).toEqual(54);
    service.deleteNode('group3');
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('group2'), 'group3')
    ).toBeFalsy();
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('group2'), 'group4')
    ).toBeTruthy();
    expect(projectService.getNodes().length).toEqual(51);
  });
}

function shouldDeleteTheLastActivityFromTheProject() {
  it('should delete the last activity from the project', () => {
    projectService.setProject(demoProjectJSON);
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('group4'), 'group5')
    ).toBeTruthy();
    expect(projectService.getTransitionsByFromNodeId('group4').length).toEqual(1);
    expect(projectService.getNodes().length).toEqual(54);
    service.deleteNode('group5');
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('group4'), 'group5')
    ).toBeFalsy();
    expect(projectService.getTransitionsByFromNodeId('group4').length).toEqual(0);
    expect(projectService.getNodes().length).toEqual(48);
  });
}

function deleteActivityWithBranching() {
  it(`should delete an activity with branching and is also the first activity in the project
      and properly set the project start node id`, () => {
    projectService.setProject(demoProjectJSON);
    expect(projectService.getStartNodeId()).toEqual('node1');
    service.deleteNode('group1');
    expect(projectService.getStartNodeId()).toEqual('node20');
  });

  it(`should delete an activity in the middle of the project with branching and properly remove
      transitions from remaining steps`, () => {
    projectService.setProject(demoProjectJSON);
    const node19 = projectService.getNodeById('node19');
    const node19Transitions = node19.transitionLogic.transitions;
    expect(node19Transitions.length).toEqual(1);
    expect(node19Transitions[0].to).toEqual('node20');
    service.deleteNode('group2');
    expect(node19Transitions.length).toEqual(1);
    expect(node19Transitions[0].to).toEqual('node790');
  });

  it(`should delete an activity at the end of the project with branching and properly remove
      transitions from remaining steps`, () => {
    projectService.setProject(demoProjectJSON);
    const node798 = projectService.getNodeById('node798');
    const node798Transitions = node798.transitionLogic.transitions;
    expect(node798Transitions.length).toEqual(1);
    expect(node798Transitions[0].to).toEqual('node799');
    service.deleteNode('group5');
    expect(node798Transitions.length).toEqual(0);
  });
}

function deleteTheLastStepInAnActivity() {
  it(`should delete the last step in an activity in the middle of the project and set previous
      step to transition to the first step of the next activity`, () => {
    projectService.setProject(demoProjectJSON);
    const node790Transitions = projectService.getTransitionsByFromNodeId('node790');
    expect(node790Transitions.length).toEqual(1);
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('node790'), 'node791')
    ).toBeTruthy();
    service.deleteNode('node791');
    expect(node790Transitions.length).toEqual(1);
    expect(
      projectService.nodeHasTransitionToNodeId(projectService.getNodeById('node790'), 'node792')
    ).toBeTruthy();
  });
}

function deleteAllStepsInAnActivity() {
  it(`should delete all steps in an activity in the middle of the project and set previous step
      to transition to activity`, () => {
    projectService.setProject(demoProjectJSON);
    const node34 = projectService.getNodeById('node34');
    const node34Transitions = node34.transitionLogic.transitions;
    expect(node34Transitions.length).toEqual(1);
    expect(node34Transitions[0].to).toEqual('node790');
    service.deleteNode('node790');
    service.deleteNode('node791');
    expect(node34Transitions.length).toEqual(1);
    expect(node34Transitions[0].to).toEqual('group3');
  });
}
