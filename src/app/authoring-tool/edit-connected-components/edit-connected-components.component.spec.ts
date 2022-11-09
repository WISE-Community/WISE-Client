import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditConnectedComponentsAddButtonComponent } from '../edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsComponent } from './edit-connected-components.component';

let component: EditConnectedComponentsComponent;
let fixture: ComponentFixture<EditConnectedComponentsComponent>;
const componentId1 = 'component1';
const componentId2 = 'component2';
const componentId10 = 'component10';
const nodeId1 = 'node1';
const nodeId10 = 'node10';
const importWorkType = 'importWork';

describe('EditConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatIconModule, StudentTeacherCommonServicesModule],
      declarations: [EditConnectedComponentsAddButtonComponent, EditConnectedComponentsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentsComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId10;
    component.componentId = componentId10;
    fixture.detectChanges();
  });

  addConnectedComponent();
  automaticallySetConnectedComponentComponentIdIfPossible();
  deleteConnectedComponent();
});

export function createConnectedComponentObject(
  nodeId: string,
  componentId: string,
  type: string = 'importWork'
): any {
  return {
    nodeId: nodeId,
    componentId: componentId,
    type: type
  };
}

function createComponentObject(id: string, type: string): any {
  return {
    id: id,
    type: type
  };
}

function addConnectedComponent() {
  describe('addConnectedComponent', () => {
    it('should add a connected component', () => {
      expect(component.connectedComponents.length).toEqual(0);
      component.addConnectedComponent();
      expect(component.connectedComponents.length).toEqual(1);
    });
  });
}

function automaticallySetConnectedComponentComponentIdIfPossible() {
  describe('automaticallySetConnectedComponentComponentIdIfPossible', () => {
    it(`should not automatically set connected component component id there are no acceptable
        component types`, () => {
      const connectedComponent = createConnectedComponentObject(nodeId1, null, null);
      spyOn(TestBed.inject(ProjectService), 'getComponents').and.returnValue([
        createComponentObject(componentId1, 'Table'),
        createComponentObject(componentId2, 'Graph')
      ]);
      component.allowedConnectedComponentTypes = ['OpenResponse'];
      component.automaticallySetConnectedComponentComponentIdIfPossible(connectedComponent);
      expect(connectedComponent.nodeId).toEqual(nodeId1);
      expect(connectedComponent.componentId).toEqual(null);
      expect(connectedComponent.type).toEqual(null);
    });
    it('should automatically set connected component component id if possible', () => {
      const connectedComponent = createConnectedComponentObject(nodeId1, null, null);
      spyOn(TestBed.inject(ProjectService), 'getComponents').and.returnValue([
        createComponentObject(componentId1, 'Table'),
        createComponentObject(componentId2, 'OpenResponse')
      ]);
      component.allowedConnectedComponentTypes = ['OpenResponse'];
      component.automaticallySetConnectedComponentComponentIdIfPossible(connectedComponent);
      expect(connectedComponent.nodeId).toEqual(nodeId1);
      expect(connectedComponent.componentId).toEqual(componentId2);
      expect(connectedComponent.type).toEqual(importWorkType);
    });
  });
}

function deleteConnectedComponent() {
  describe('deleteConnectedComponent', () => {
    it('should delete a connected component', () => {
      component.addConnectedComponent();
      expect(component.connectedComponents.length).toEqual(1);
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteConnectedComponent(0);
      expect(component.connectedComponents.length).toEqual(0);
    });
  });
}
