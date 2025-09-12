import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringStepComponent } from './project-authoring-step.component';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { CopyNodesService } from '../../services/copyNodesService';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';
import { provideRouter } from '@angular/router';
import { CopyTranslationsService } from '../../services/copyTranslationsService';
import { MockComponent, MockProvider, MockProviders } from 'ng-mocks';
import { ConstraintService } from '../../services/constraintService';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { NodeTypeSelected } from '../domain/node-type-selected';
import { signal } from '@angular/core';
import { Node } from '../../common/Node';

const nodeId1 = 'nodeId1';
const node = { id: nodeId1 };
describe('ProjectAuthoringStepComponent', () => {
  let component: ProjectAuthoringStepComponent;
  let fixture: ComponentFixture<ProjectAuthoringStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectAuthoringStepComponent, MockComponent(NodeIconAndTitleComponent)],
      providers: [
        MockProviders(
          CopyNodesService,
          CopyTranslationsService,
          ConstraintService,
          TeacherDataService,
          DeleteNodeService,
          DeleteTranslationsService
        ),
        MockProvider(TeacherProjectService, {
          getNodeTypeSelected: () => signal<NodeTypeSelected>(NodeTypeSelected.lesson)
        }),
        provideRouter([])
      ]
    });
    fixture = TestBed.createComponent(ProjectAuthoringStepComponent);
    component = fixture.componentInstance;
    component.step = node;
    const idToNode = {};
    idToNode[nodeId1] = node;
    const projectService = TestBed.inject(TeacherProjectService);
    projectService.idToNode = idToNode;
    spyOn(projectService, 'isDefaultLocale').and.returnValue(true);
    spyOn(projectService, 'getNode').and.returnValue(new Node());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
