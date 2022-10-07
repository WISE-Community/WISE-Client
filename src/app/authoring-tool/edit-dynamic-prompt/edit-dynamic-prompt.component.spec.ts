import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    component.authoringComponentContent = {};
    fixture.detectChanges();
  });

  toggleDynamicPrompt();
  referenceComponentNodeIdChanged();
});

function toggleDynamicPrompt() {
  describe('toggleDynamicPrompt()', () => {
    it('should toggle dynamic prompt on when it does not exist', () => {
      expect(component.authoringComponentContent.dynamicPrompt).toBeUndefined();
      callToggleDynamicPrompt(true);
      expect(component.authoringComponentContent.dynamicPrompt).not.toBeNull();
    });

    it('should toggle dynamic prompt off', () => {
      component.authoringComponentContent.dynamicPrompt = {
        enabled: true
      };
      callToggleDynamicPrompt(false);
      expect(component.authoringComponentContent.dynamicPrompt.enabled).toBeFalse();
    });

    it('should toggle dynamic prompt on', () => {
      component.authoringComponentContent.dynamicPrompt = {
        enabled: false
      };
      callToggleDynamicPrompt(true);
      expect(component.authoringComponentContent.dynamicPrompt.enabled).toBeTrue();
    });
  });
}

function callToggleDynamicPrompt(checked: boolean): void {
  component.toggleDynamicPrompt({ checked: checked });
}

function referenceComponentNodeIdChanged() {
  describe('referenceComponentNodeIdChanged', () => {
    beforeEach(() => {
      component.authoringComponentContent.dynamicPrompt = new DynamicPrompt({
        referenceComponent: {}
      });
    });

    it('should handle node id changed when there are no allowed components in it', () => {
      setUpGetComponentsByNodeIdSpy([
        createComponent(component1Id, 'Draw'),
        createComponent(component2Id, 'Graph'),
        createComponent(component3Id, 'Table')
      ]);
      changeReferenceComponentNodeId(node1Id);
      expectReferenceComponentNodeIdAndComponentId(
        component.authoringComponentContent.dynamicPrompt.referenceComponent,
        node1Id,
        null
      );
    });

    it('should handle node id changed when there is only one allowed component in it', () => {
      setUpGetComponentsByNodeIdSpy([
        createComponent(component1Id, 'Draw'),
        createComponent(component2Id, 'OpenResponse'),
        createComponent(component3Id, 'Table')
      ]);
      changeReferenceComponentNodeId(node1Id);
      expectReferenceComponentNodeIdAndComponentId(
        component.authoringComponentContent.dynamicPrompt.referenceComponent,
        node1Id,
        component2Id
      );
    });

    it('should handle node id changed when there are multiple allowed components in it', () => {
      setUpGetComponentsByNodeIdSpy([
        createComponent(component1Id, 'Draw'),
        createComponent(component2Id, 'OpenResponse'),
        createComponent(component3Id, 'OpenResponse')
      ]);
      changeReferenceComponentNodeId(node1Id);
      expectReferenceComponentNodeIdAndComponentId(
        component.authoringComponentContent.dynamicPrompt.referenceComponent,
        node1Id,
        null
      );
    });
  });
}

function setUpGetComponentsByNodeIdSpy(components: any[]): void {
  spyOn(TestBed.inject(ProjectService), 'getComponentsByNodeId').and.returnValue(components);
}

function changeReferenceComponentNodeId(nodeId: string): void {
  const referenceComponent = component.authoringComponentContent.dynamicPrompt.referenceComponent;
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
