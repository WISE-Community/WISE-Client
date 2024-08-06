import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ProjectService } from '../../../services/projectService';
import { ConceptMapContent } from '../ConceptMapContent';
import { EditConceptMapConnectedComponentsComponent } from './edit-concept-map-connected-components.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EditConceptMapConnectedComponentsComponent;
let fixture: ComponentFixture<EditConceptMapConnectedComponentsComponent>;
const componentId1 = 'componentId1';
const nodeId1 = 'nodeId1';

describe('EditConceptMapConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditConceptMapConnectedComponentsComponent
    ],
    imports: [MatIconModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
      spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({
        id: componentId1,
        nodes: [createNode('node1', 'Tree', 'tree.png')],
        links: [createLink('link1', 'Energy', 'green')]
      } as ConceptMapContent);
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
