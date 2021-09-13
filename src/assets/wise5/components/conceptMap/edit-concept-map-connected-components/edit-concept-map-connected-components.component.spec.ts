import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { UtilService } from '../../../services/utilService';
import { EditConceptMapConnectedComponentsComponent } from './edit-concept-map-connected-components.component';

let component: EditConceptMapConnectedComponentsComponent;
let fixture: ComponentFixture<EditConceptMapConnectedComponentsComponent>;
const componentId1 = 'componentId1';
const nodeId1 = 'nodeId1';

describe('EditConceptMapConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatIconModule, UpgradeModule],
      declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditConceptMapConnectedComponentsComponent
      ],
      providers: [ConfigService, ProjectService, SessionService, UtilService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConceptMapConnectedComponentsComponent);
    component = fixture.componentInstance;
    component.componentContent = {
      nodes: [],
      links: []
    };
    fixture.detectChanges();
  });

  askIfWantToCopyNodesAndLinks();
});

function createNode(id: string, label: string, fileName: string): any {
  return {
    id: id,
    label: label,
    fileName: fileName,
    height: 100,
    width: 100
  };
}

function createLink(id: string, label: string, color: string = 'blue'): any {
  return {
    id: id,
    label: label,
    color: color
  };
}

function askIfWantToCopyNodesAndLinks() {
  describe('askIfWantToCopyNodesAndLinks', () => {
    beforeEach(() => {
      spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue({
        id: componentId1,
        nodes: [createNode('node1', 'Tree', 'tree.png')],
        links: [createLink('link1', 'Energy', 'green')]
      });
    });
    it('should copy nodes and links', () => {
      expectNumberOfNodesAndLinks(component.componentContent, 0, 0);
      spyOn(window, 'confirm').and.returnValue(true);
      component.askIfWantToCopyNodesAndLinks({ nodeId: nodeId1, componentId: componentId1 });
      expectNumberOfNodesAndLinks(component.componentContent, 1, 1);
    });
    it('should not copy nodes and links', () => {
      expectNumberOfNodesAndLinks(component.componentContent, 0, 0);
      spyOn(window, 'confirm').and.returnValue(false);
      component.askIfWantToCopyNodesAndLinks({ nodeId: nodeId1, componentId: componentId1 });
      expectNumberOfNodesAndLinks(component.componentContent, 0, 0);
    });
  });
}

function expectNumberOfNodesAndLinks(componentContent: any, numNodes: number, numLinks: number) {
  expect(componentContent.nodes.length).toEqual(numNodes);
  expect(componentContent.links.length).toEqual(numLinks);
}
