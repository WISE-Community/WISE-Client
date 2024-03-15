import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectStepAndComponentCheckboxesComponent } from './select-step-and-component-checkboxes.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import * as demoProjectJSON_import from '../../../../../app/services/sampleData/curriculum/Demo.project.json';
import { copy } from '../../../common/object/object';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { SelectStepAndComponentCheckboxesComponentHarness } from './select-step-and-component-checkboxes.harness';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

let component: SelectStepAndComponentCheckboxesComponent;
let fixture: ComponentFixture<SelectStepAndComponentCheckboxesComponent>;
const groupId1 = 'group1';
let harness: SelectStepAndComponentCheckboxesComponentHarness;
const nodeId1 = 'node10';
let nodes: any[];
let project: any;
let projectService: TeacherProjectService;

describe('SelectStepAndComponentCheckboxesComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [SelectStepAndComponentCheckboxesComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatRadioModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    });
    projectService = TestBed.inject(TeacherProjectService);
    project = copy(demoProjectJSON_import);
    projectService.setProject(project);
    fixture = TestBed.createComponent(SelectStepAndComponentCheckboxesComponent);
    component = fixture.componentInstance;
    const nodeOrderOfProject = projectService.getNodeOrderOfProject(project);
    const projectIdToOrder = nodeOrderOfProject.idToOrder;
    component.projectIdToOrder = projectIdToOrder;
    nodes = Object.values(projectIdToOrder);
    nodes.sort(sortNodesByOrder);
    component.nodes = nodes;
    component.exportStepSelectionType = 'exportSelectSteps';
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      SelectStepAndComponentCheckboxesComponentHarness
    );
  });

  selectStep_selectsAllComponentsInStep();
  selectLesson_selectsAllStepsAndComponentsInLesson();
  selectAll_selectsEverything();
  deselectAll_deselectsEverything();
});

function sortNodesByOrder(nodeA: any, nodeB: any): number {
  return nodeA.order - nodeB.order;
}

function selectStep_selectsAllComponentsInStep() {
  describe('select a step', () => {
    it('selects all components in the lesson', async () => {
      expectAllChildrenOfStepToBeCheckedValue(nodeId1, undefined);
      const checkbox = await harness.getCheckbox('1.10: Questionnaire Step');
      await checkbox.check();
      expectAllChildrenOfStepToBeCheckedValue(nodeId1, true);
    });
  });
}

function selectLesson_selectsAllStepsAndComponentsInLesson() {
  describe('select a lesson', () => {
    it('selects all steps and components in the lesson', async () => {
      expectAllChildrenOfLessonToBeCheckedValue(groupId1, undefined);
      const checkbox = await harness.getCheckbox('1: Example Steps');
      await checkbox.check();
      expectAllChildrenOfLessonToBeCheckedValue(groupId1, true);
    });
  });
}

function selectAll_selectsEverything() {
  describe('select all button is clicked', () => {
    it('all lessons, steps, and components are checked', async () => {
      (await harness.getSelectAllButton()).click();
      const checkboxes = await harness.getCheckboxes();
      for (const checkbox of checkboxes) {
        expect(await checkbox.isChecked()).toEqual(true);
      }
    });
  });
}

function deselectAll_deselectsEverything() {
  describe('deselect all button is clicked', () => {
    it('all lessons, steps, and components are not checked', async () => {
      (await harness.getDeselectAllButton()).click();
      const checkboxes = await harness.getCheckboxes();
      for (const checkbox of checkboxes) {
        expect(await checkbox.isChecked()).toEqual(false);
      }
    });
  });
}

function expectAllChildrenOfStepToBeCheckedValue(
  nodeId: string,
  expectedCheckedValue: boolean
): void {
  const node = component.projectIdToOrder[nodeId];
  const components = node.node.components;
  for (const component of components) {
    expect(component.checked).toEqual(expectedCheckedValue);
  }
}

function expectAllChildrenOfLessonToBeCheckedValue(
  nodeId: string,
  expectedCheckedValue: boolean
): void {
  const node = component.projectIdToOrder[nodeId];
  for (const childId of node.node.ids) {
    expect(component.projectIdToOrder[childId].checked).toEqual(expectedCheckedValue);
    expectAllChildrenOfStepToBeCheckedValue(childId, expectedCheckedValue);
  }
}
