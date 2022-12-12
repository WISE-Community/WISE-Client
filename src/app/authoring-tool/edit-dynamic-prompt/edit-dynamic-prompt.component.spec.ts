import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { DynamicPrompt } from '../../../assets/wise5/directives/dynamic-prompt/DynamicPrompt';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditDynamicPromptComponent } from './edit-dynamic-prompt.component';

let component: EditDynamicPromptComponent;
const component0Id = 'component0';
const component1Id = 'component1';
const component2Id = 'component2';
const component3Id = 'component3';
let fixture: ComponentFixture<EditDynamicPromptComponent>;
const node1Id: string = 'node1';

function createComponent(id: string, type: string): any {
  return { id: id, type: type };
}

describe('EditDynamicPromptComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDynamicPromptComponent],
      imports: [HttpClientTestingModule, MatCheckboxModule, StudentTeacherCommonServicesModule],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDynamicPromptComponent);
    component = fixture.componentInstance;
    component.componentContent = {};
    fixture.detectChanges();
  });

  toggleDynamicPrompt();
  referenceComponentNodeIdChanged();
});

function toggleDynamicPrompt() {
  describe('toggleDynamicPrompt()', () => {
    it('should toggle dynamic prompt on when it does not exist', () => {
      expect(component.componentContent.dynamicPrompt).toBeUndefined();
      callToggleDynamicPrompt(true);
      expect(component.componentContent.dynamicPrompt.enabled).toBeTrue();
    });

    it('should toggle dynamic prompt off', () => {
      callToggleDynamicPrompt(false);
      expect(component.componentContent.dynamicPrompt.enabled).toBeFalse();
    });
  });
}

function callToggleDynamicPrompt(checked: boolean): void {
  const event = new MatCheckboxChange();
  event.checked = checked;
  component.toggleDynamicPrompt(event);
}

function referenceComponentNodeIdChanged() {
  describe('referenceComponentNodeIdChanged()', () => {
    beforeEach(() => {
      component.componentContent.dynamicPrompt = new DynamicPrompt({
        referenceComponent: {}
      });
    });
    referenceComponentNodeIdChanged_NoAllowedComponents_HandleNodeIdChanged();
    referenceComponentNodeIdChanged_OneAllowedComponent_HandleNodeIdChanged();
    referenceComponentNodeIdChanged_MultipleAllowedComponents_HandleNodeIdChanged();
  });
}

function referenceComponentNodeIdChanged_NoAllowedComponents_HandleNodeIdChanged() {
  it('should handle node id changed when there are no allowed components in it', () => {
    setUpGetComponentsSpy([
      createComponent(component1Id, 'Draw'),
      createComponent(component2Id, 'Graph'),
      createComponent(component3Id, 'Table')
    ]);
    changeReferenceComponentNodeId(node1Id);
    expectReferenceComponentNodeIdAndComponentId(
      component.componentContent.dynamicPrompt.referenceComponent,
      node1Id,
      null
    );
  });
}

function referenceComponentNodeIdChanged_OneAllowedComponent_HandleNodeIdChanged() {
  it('should handle node id changed when there is only one allowed component in it', () => {
    setUpGetComponentsSpy([
      createComponent(component1Id, 'Draw'),
      createComponent(component2Id, 'OpenResponse'),
      createComponent(component3Id, 'Table')
    ]);
    changeReferenceComponentNodeId(node1Id);
    expectReferenceComponentNodeIdAndComponentId(
      component.componentContent.dynamicPrompt.referenceComponent,
      node1Id,
      component2Id
    );
  });
}

function referenceComponentNodeIdChanged_MultipleAllowedComponents_HandleNodeIdChanged() {
  it('should handle node id changed when there are multiple allowed components in it', () => {
    setUpGetComponentsSpy([
      createComponent(component1Id, 'Draw'),
      createComponent(component2Id, 'OpenResponse'),
      createComponent(component3Id, 'OpenResponse')
    ]);
    changeReferenceComponentNodeId(node1Id);
    expectReferenceComponentNodeIdAndComponentId(
      component.componentContent.dynamicPrompt.referenceComponent,
      node1Id,
      null
    );
  });
}

function setUpGetComponentsSpy(components: any[]): void {
  spyOn(TestBed.inject(ProjectService), 'getComponents').and.returnValue(components);
}

function changeReferenceComponentNodeId(nodeId: string): void {
  const referenceComponent = component.componentContent.dynamicPrompt.referenceComponent;
  referenceComponent.nodeId = node1Id;
  component.referenceComponentNodeIdChanged({ nodeId: node1Id, componentId: component0Id });
}

function expectReferenceComponentNodeIdAndComponentId(
  referenceComponent: any,
  expectedNodeId: string,
  expectedComponentId: string
): void {
  expect(referenceComponent.nodeId).toEqual(expectedNodeId);
  expect(referenceComponent.componentId).toEqual(expectedComponentId);
}
