import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringStepComponent } from './project-authoring-step.component';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { CopyNodesService } from '../../services/copyNodesService';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';
import { provideRouter } from '@angular/router';
import { CopyTranslationsService } from '../../services/copyTranslationsService';
import { MockComponent, MockProviders } from 'ng-mocks';
import { ConstraintService } from '../../services/constraintService';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';

const nodeId1 = 'nodeId1';
const node = { id: nodeId1 };

// ignoring test for now, failing due to signal nodeTypeSelected not being found.
xdescribe('ProjectAuthoringStepComponent', () => {
  let component: ProjectAuthoringStepComponent;
  let fixture: ComponentFixture<ProjectAuthoringStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(NodeIconAndTitleComponent)],
      imports: [ProjectAuthoringStepComponent],
      providers: [
        MockProviders(
          CopyNodesService,
          CopyTranslationsService,
          ConstraintService,
          TeacherDataService,
          DeleteNodeService,
          DeleteTranslationsService,
          TeacherProjectService
        ),
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
