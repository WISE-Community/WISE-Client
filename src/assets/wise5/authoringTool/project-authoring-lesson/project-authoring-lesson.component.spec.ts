import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringLessonComponent } from './project-authoring-lesson.component';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';
import { provideRouter } from '@angular/router';
import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';
import { TeacherProjectTranslationService } from '../../services/teacherProjectTranslationService';
import { ProjectService } from '../../services/projectService';
import { AddStepButtonComponent } from '../add-step-button/add-step-button.component';
import { signal } from '@angular/core';
import { NodeTypeSelected } from '../domain/node-type-selected';
import { CopyNodesService } from '../../services/copyNodesService';
import { CopyTranslationsService } from '../../services/copyTranslationsService';
import { ConstraintService } from '../../services/constraintService';
import { Node } from '../../common/Node';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { MoveNodesService } from '../../services/moveNodesService';
import { of } from 'rxjs';

let component: ProjectAuthoringLessonComponent;
let fixture: ComponentFixture<ProjectAuthoringLessonComponent>;
const groupId1 = 'group1';
const nodeId1 = 'node1';
const nodeId2 = 'node2';
let teacherProjectService: TeacherProjectService;

const group1 = {
  id: groupId1,
  type: 'group',
  title: 'Lesson 1',
  ids: [nodeId1, nodeId2],
  startId: nodeId1
};
const node1 = { id: nodeId1, title: 'Step 1' };
const node2 = { id: nodeId2, title: 'Step 2' };

describe('ProjectAuthoringLessonComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MockComponents(AddStepButtonComponent, NodeIconAndTitleComponent)],
      providers: [
        MockProviders(
          ConstraintService,
          CopyNodesService,
          CopyTranslationsService,
          DeleteNodeService,
          DeleteTranslationsService,
          ProjectService,
          TeacherDataService,
          TeacherProjectTranslationService
        ),
        MockProvider(MoveNodesService, {
          getIsDragging: () => signal<boolean>(false)
        }),
        MockProvider(TeacherProjectService, {
          getNodeTypeSelected: () => signal<NodeTypeSelected>(NodeTypeSelected.lesson),
          projectParsed$: of()
        }),
        provideRouter([])
      ]
    });
    teacherProjectService = TestBed.inject(TeacherProjectService);
    teacherProjectService.idToNode = {
      group1: group1,
      node1: node1,
      node2: node2
    };
    teacherProjectService.project = { nodes: [group1, node1, node2], startNodeId: nodeId1 };
    spyOn(teacherProjectService, 'isDefaultLocale').and.returnValue(true);
    spyOn(teacherProjectService, 'getNode').and.returnValue(new Node());
    spyOn(TestBed.inject(ProjectService), 'getNode').and.returnValue(new Node());
    fixture = TestBed.createComponent(ProjectAuthoringLessonComponent);
    component = fixture.componentInstance;
    component.lesson = group1;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });
});
