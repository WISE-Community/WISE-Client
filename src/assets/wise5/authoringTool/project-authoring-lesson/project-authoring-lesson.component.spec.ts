import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringLessonComponent } from './project-authoring-lesson.component';
import { TeacherDataService } from '../../services/teacherDataService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProjectAuthoringStepComponent } from '../project-authoring-step/project-authoring-step.component';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ProjectAuthoringLessonHarness } from './project-authoring-lesson.harness';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { CopyNodesService } from '../../services/copyNodesService';
import { MatMenuModule } from '@angular/material/menu';
import { AddStepButtonComponent } from '../add-step-button/add-step-button.component';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';
import { provideRouter } from '@angular/router';
import { CopyTranslationsService } from '../../services/copyTranslationsService';
import { TeacherProjectTranslationService } from '../../services/teacherProjectTranslationService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: ProjectAuthoringLessonComponent;
let fixture: ComponentFixture<ProjectAuthoringLessonComponent>;
const groupId1 = 'group1';
let harness: ProjectAuthoringLessonHarness;
const nodeId1 = 'node1';
const nodeId2 = 'node2';
let teacherProjectService: TeacherProjectService;

const node1 = { id: nodeId1, title: 'Step 1' };
const node2 = { id: nodeId2, title: 'Step 2' };

describe('ProjectAuthoringLessonComponent', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ProjectAuthoringLessonComponent, ProjectAuthoringStepComponent],
      imports: [
        AddStepButtonComponent,
        FormsModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        NodeIconAndTitleComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        CopyNodesService,
        CopyTranslationsService,
        DeleteNodeService,
        DeleteTranslationsService,
        provideRouter([]),
        TeacherDataService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        TeacherWebSocketService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    teacherProjectService = TestBed.inject(TeacherProjectService);
    teacherProjectService.idToNode = {
      node1: node1,
      node2: node2
    };
    teacherProjectService.project = { nodes: [node1, node2] };
    spyOn(teacherProjectService, 'isDefaultLocale').and.returnValue(true);
    fixture = TestBed.createComponent(ProjectAuthoringLessonComponent);
    component = fixture.componentInstance;
    component.lesson = {
      id: groupId1,
      ids: [nodeId1, nodeId2],
      type: 'group'
    };
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      ProjectAuthoringLessonHarness
    );
  });

  lessonIsExpanded_clickCollapseButton_hideSteps();
  lessonIsCollapsed_clickExpandButton_showSteps();
});

function lessonIsExpanded_clickCollapseButton_hideSteps() {
  describe('lesson is expanded', () => {
    describe('lesson div is clicked', () => {
      it('hides steps', async () => {
        component.expanded = true;
        (await harness.getExpandCollapseDiv()).click();
        expect(component.expanded).toBeFalse();
        const steps = await harness.getSteps();
        expect(steps.length).toEqual(0);
      });
    });
  });
}

function lessonIsCollapsed_clickExpandButton_showSteps() {
  describe('lesson is collapsed', () => {
    describe('lesson div is clicked', () => {
      it('shows steps', async () => {
        component.expanded = false;
        (await harness.getExpandCollapseDiv()).click();
        expect(component.expanded).toBeTrue();
        const steps = await harness.getSteps();
        expect(steps.length).toEqual(2);
      });
    });
  });
}
