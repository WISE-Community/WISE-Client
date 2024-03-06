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
import { ActivatedRoute, Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { ConfigService } from '../../services/configService';
import { of } from 'rxjs/internal/observable/of';
import { HttpClient } from '@angular/common/http';
import { AddLessonButtonComponent } from '../add-lesson-button/add-lesson-button.component';

const addLessonAfterRegex = /Add Lesson After/;
const addLessonBeforeRegex = /Add Lesson Before/;
let configService: ConfigService;
let component: ProjectAuthoringComponent;
let getConfigParamSpy: jasmine.Spy;
let fixture: ComponentFixture<ProjectAuthoringComponent>;
let harness: ProjectAuthoringHarness;
let http: HttpClient;
let projectService: TeacherProjectService;
let route: ActivatedRoute;
let router: Router;

describe('ProjectAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddLessonButtonComponent,
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
        MatMenuModule,
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
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpClient);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    window.history.pushState({}, '', '');
    getConfigParamSpy = spyOn(configService, 'getConfigParam');
    getConfigParamSpy.withArgs('canEditProject').and.returnValue(true);
    getConfigParamSpy.withArgs('mode').and.returnValue('author');
    getConfigParamSpy.withArgs('saveProjectURL').and.returnValue('/api/author/project/save/1');
    spyOn(configService, 'getMyUserInfo').and.returnValue({
      userId: 4,
      firstName: 'Spongebob',
      lastName: 'Squarepants',
      username: 'spongebobsquarepants'
    });
    spyOn(http, 'post').and.returnValue(of({ status: 'success' }) as any);
    fixture = TestBed.createComponent(ProjectAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ProjectAuthoringHarness);
  });

  collapseAllButtonClicked();
  expandAllButtonClicked();
  copySpecificStep();
  deleteSpecificStep();
  moveSpecificStep();
  deleteSpecificLesson();
  moveSpecificLesson();
  addStep();
  addLesson();
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

function copySpecificStep() {
  describe('copy step button on a specific step is clicked', () => {
    it('creates a copy of the step and puts it after the original step', async () => {
      const stepCount = (await harness.getSteps()).length;
      const newStepNumberAndTitle = '1.2: HTML Step';
      expect(await harness.getStep(newStepNumberAndTitle)).toEqual(null);
      const step = await harness.getStep('1.1: HTML Step');
      await (await step.getCopyButton()).click();
      expect(await harness.getStep(newStepNumberAndTitle)).not.toEqual(null);
      expect((await harness.getSteps()).length).toEqual(stepCount + 1);
    });
  });
}

function deleteSpecificStep() {
  describe('delete step button on a specific step is clicked', () => {
    it('deletes the step', async () => {
      const stepCount = (await harness.getSteps()).length;
      spyOn(window, 'confirm').and.returnValue(true);
      const step = await harness.getStep('1.1: HTML Step');
      await (await step.getDeleteButton()).click();
      expect((await harness.getSteps()).length).toEqual(stepCount - 1);
    });
  });
}

function moveSpecificStep() {
  describe('move step button on a specific step is clicked', () => {
    it('navigates to choose location view', async () => {
      const navigateSpy = spyOn(router, 'navigate');
      const step = await harness.getStep('1.1: HTML Step');
      await (await step.getMoveButton()).click();
      expect(navigateSpy).toHaveBeenCalledWith(['choose-move-location'], {
        relativeTo: route,
        state: {
          selectedNodeIds: ['node1']
        }
      });
    });
  });
}

function deleteSpecificLesson() {
  describe('delete lesson button on a specific lesson is clicked', () => {
    it('deletes the lesson', async () => {
      const lessonCount = (await harness.getLessons()).length;
      spyOn(window, 'confirm').and.returnValue(true);
      const lesson = await harness.getLesson('1: Example Steps');
      await (await lesson.getDeleteButton()).click();
      expect((await harness.getLessons()).length).toEqual(lessonCount - 1);
    });
  });
}

function moveSpecificLesson() {
  describe('move lesson button on a specific lesson is clicked', () => {
    it('navigates to choose location view', async () => {
      const navigateSpy = spyOn(router, 'navigate');
      const lesson = await harness.getLesson('1: Example Steps');
      await (await lesson.getMoveButton()).click();
      expect(navigateSpy).toHaveBeenCalledWith(['choose-move-location'], {
        relativeTo: route,
        state: {
          selectedNodeIds: ['group1']
        }
      });
    });
  });
}

function addStep() {
  addStepBefore();
  addStepBeforeFirstStepInLesson();
  addStepAfter();
}

function addStepBefore() {
  describe('add step button is clicked on a step that is not the first step in a lesson', () => {
    describe('add step before is chosen on the menu', () => {
      it('adds a step before the chosen step', async () => {
        const addStepButtons = await harness.getAddStepButtons();
        addStepButtons[1].click();
        const addStepMenu = await harness.getOpenedAddStepMenu();
        await addStepMenu.clickItem({ text: /Add Step Before/ });
        const newStep = await harness.getStep('1.2: New Step');
        expect(newStep).not.toEqual(null);
      });
    });
  });
}

function addStepBeforeFirstStepInLesson() {
  describe('add step button is clicked on a step that is the first step in a lesson', () => {
    describe('add step before is chosen on the menu', () => {
      it('adds a step before the chosen step', async () => {
        const addStepButtons = await harness.getAddStepButtons();
        addStepButtons[0].click();
        const addStepMenu = await harness.getOpenedAddStepMenu();
        await addStepMenu.clickItem({ text: /Add Step Before/ });
        const newStep = await harness.getStep('1.1: New Step');
        expect(newStep).not.toEqual(null);
      });
    });
  });
}

function addStepAfter() {
  describe('add step button is clicked', () => {
    describe('add step after is chosen on the menu', () => {
      it('adds a step after the chosen step', async () => {
        const addStepButtons = await harness.getAddStepButtons();
        addStepButtons[1].click();
        const addStepMenu = await harness.getOpenedAddStepMenu();
        await addStepMenu.clickItem({ text: /Add Step After/ });
        const newStep = await harness.getStep('1.3: New Step');
        expect(newStep).not.toEqual(null);
      });
    });
  });
}

function addLesson() {
  addLessonBefore();
  addLessonBeforeFirstLesson();
  addLessonAfter();
  addInactiveLessonBefore();
  addInactiveLessonBeforeFirstLesson();
  addInactiveLessonAfter();
}

function addLessonBeforeFirstLesson() {
  describe('add lesson button is clicked on a lesson that is the first lesson', () => {
    describe('add lesson before is chosen on the menu', () => {
      it('adds a lesson before the chosen lesson', async () => {
        const addLessonButtons = await harness.getAddLessonButtons();
        addLessonButtons[0].click();
        const addLessonMenu = await harness.getOpenedAddStepMenu();
        await addLessonMenu.clickItem({ text: addLessonBeforeRegex });
        const newLesson = await harness.getLesson('1: New Lesson');
        expect(newLesson).not.toEqual(null);
      });
    });
  });
}

function addLessonBefore() {
  describe('add lesson button is clicked on a lesson that is not the first lesson', () => {
    describe('add lesson before is chosen on the menu', () => {
      it('adds a lesson before the chosen lesson', async () => {
        const addLessonButtons = await harness.getAddLessonButtons();
        addLessonButtons[1].click();
        const addLessonMenu = await harness.getOpenedAddStepMenu();
        await addLessonMenu.clickItem({ text: addLessonBeforeRegex });
        const newLesson = await harness.getLesson('2: New Lesson');
        expect(newLesson).not.toEqual(null);
      });
    });
  });
}

function addLessonAfter() {
  describe('add lesson button is clicked', () => {
    describe('add lesson after is chosen on the menu', () => {
      it('adds a lesson after the chosen lesson', async () => {
        const addLessonButtons = await harness.getAddLessonButtons();
        addLessonButtons[0].click();
        const addLessonMenu = await harness.getOpenedAddStepMenu();
        await addLessonMenu.clickItem({ text: addLessonAfterRegex });
        const newLesson = await harness.getLesson('2: New Lesson');
        expect(newLesson).not.toEqual(null);
      });
    });
  });
}

function addInactiveLessonBeforeFirstLesson() {
  describe('add lesson button is clicked on an inactive lesson that is the first inactive lesson', () => {
    describe('add lesson before is chosen on the menu', () => {
      it('adds a lesson before the chosen lesson', async () => {
        const addLessonButtons = await harness.getAddLessonButtons();
        addLessonButtons[5].click();
        const addLessonMenu = await harness.getOpenedAddStepMenu();
        await addLessonMenu.clickItem({ text: addLessonBeforeRegex });
        const unusedLessonTitles = await harness.getUnusedLessonTitles();
        expect(unusedLessonTitles).toEqual([
          'New Lesson',
          'Inactive Lesson One',
          'Inactive Lesson Two'
        ]);
      });
    });
  });
}

function addInactiveLessonBefore() {
  describe('add lesson button is clicked on an inactive lesson that is not the first inactive lesson', () => {
    describe('add lesson before is chosen on the menu', () => {
      it('adds a lesson before the chosen lesson', async () => {
        const addLessonButtons = await harness.getAddLessonButtons();
        addLessonButtons[6].click();
        const addLessonMenu = await harness.getOpenedAddStepMenu();
        await addLessonMenu.clickItem({ text: addLessonBeforeRegex });
        const unusedLessonTitles = await harness.getUnusedLessonTitles();
        expect(unusedLessonTitles).toEqual([
          'Inactive Lesson One',
          'New Lesson',
          'Inactive Lesson Two'
        ]);
      });
    });
  });
}

function addInactiveLessonAfter() {
  describe('add lesson button is clicked next to an inactive lesson', () => {
    describe('add lesson after is chosen on the menu', () => {
      it('adds a lesson after the chosen lesson', async () => {
        const addLessonButtons = await harness.getAddLessonButtons();
        addLessonButtons[6].click();
        const addLessonMenu = await harness.getOpenedAddStepMenu();
        await addLessonMenu.clickItem({ text: addLessonAfterRegex });
        const unusedLessonTitles = await harness.getUnusedLessonTitles();
        expect(unusedLessonTitles).toEqual([
          'Inactive Lesson One',
          'Inactive Lesson Two',
          'New Lesson'
        ]);
      });
    });
  });
}
