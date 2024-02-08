import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringComponent } from './project-authoring.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CopyNodesService } from '../../services/copyNodesService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { MoveNodesService } from '../../services/moveNodesService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherWebSocketService } from '../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { ConcurrentAuthorsMessageComponent } from '../concurrent-authors-message/concurrent-authors-message.component';
import { NodeAuthoringComponent } from '../node/node-authoring/node-authoring.component';
import { TeacherNodeIconComponent } from '../teacher-node-icon/teacher-node-icon.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import * as demoProjectJSON_import from '../../../../app/services/sampleData/curriculum/Demo.project.json';
import { copy } from '../../common/object/object';
import { ProjectAuthoringLessonComponent } from '../project-authoring-lesson/project-authoring-lesson.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { NodeIconComponent } from '../../vle/node-icon/node-icon.component';
import { ProjectAuthoringStepComponent } from '../project-authoring-step/project-authoring-step.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectAuthoringHarness } from './project-authoring.harness';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';

let component: ProjectAuthoringComponent;
let fixture: ComponentFixture<ProjectAuthoringComponent>;
let harness: ProjectAuthoringHarness;
let projectService: TeacherProjectService;

describe('ProjectAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConcurrentAuthorsMessageComponent,
        NodeAuthoringComponent,
        NodeIconComponent,
        NodeIconAndTitleComponent,
        ProjectAuthoringComponent,
        ProjectAuthoringLessonComponent,
        ProjectAuthoringStepComponent,
        TeacherNodeIconComponent
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        CopyNodesService,
        DeleteNodeService,
        MoveNodesService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    }).compileComponents();
    projectService = TestBed.inject(TeacherProjectService);
    projectService.setProject(copy(demoProjectJSON_import));
    window.history.pushState({}, '', '');
    fixture = TestBed.createComponent(ProjectAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ProjectAuthoringHarness);
  });

  collapseAllButtonClicked();
  expandAllButtonClicked();
});

function collapseAllButtonClicked() {
  describe('all lessons are expanded', () => {
    describe('collapse all button is clicked', () => {
      let expandAllButton: MatButtonHarness;
      let collapseAllButton: MatButtonHarness;
      beforeEach(async () => {
        expandAllButton = await harness.getExpandAllButton();
        collapseAllButton = await harness.getCollapseAllButton();
        await collapseAllButton.click();
      });
      it('all lessons are collapsed', async () => {
        for (const lesson of await harness.getLessons()) {
          expect(await lesson.isCollapsed()).toBe(true);
        }
      });
      it('expand all button is enabled', async () => {
        expect(await collapseAllButton.isDisabled()).toBe(true);
      });
      it('collapse all button is disabled', async () => {
        expect(await expandAllButton.isDisabled()).toBe(false);
      });
    });
  });
}

function expandAllButtonClicked() {
  describe('all lessons are collapsed', () => {
    describe('expand all button is clicked', () => {
      let expandAllButton: MatButtonHarness;
      let collapseAllButton: MatButtonHarness;
      beforeEach(async () => {
        expandAllButton = await harness.getExpandAllButton();
        collapseAllButton = await harness.getCollapseAllButton();
        await collapseAllButton.click();
        await expandAllButton.click();
      });
      it('all lessons are expanded', async () => {
        for (const lesson of await harness.getLessons()) {
          expect(await lesson.isExpanded()).toBe(true);
        }
      });
      it('collapse all button is enabled', async () => {
        expect(await collapseAllButton.isDisabled()).toBe(false);
      });
      it('expand all button is disabled', async () => {
        expect(await expandAllButton.isDisabled()).toBe(true);
      });
    });
  });
}
