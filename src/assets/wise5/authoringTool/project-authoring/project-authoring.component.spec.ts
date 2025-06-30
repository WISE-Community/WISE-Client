import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringComponent } from './project-authoring.component';
import { CopyNodesService } from '../../services/copyNodesService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { DeleteNodeService } from '../../services/deleteNodeService';
import { MoveNodesService } from '../../services/moveNodesService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherWebSocketService } from '../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import * as demoProjectJSON_import from '../../../../app/services/sampleData/curriculum/Demo.project.json';
import { copy } from '../../common/object/object';
import { ProjectAuthoringLessonComponent } from '../project-authoring-lesson/project-authoring-lesson.component';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { ProjectAuthoringStepComponent } from '../project-authoring-step/project-authoring-step.component';
import { ProjectAuthoringHarness } from './project-authoring.harness';
import { MatButtonHarness } from '@angular/material/button/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { ConfigService } from '../../services/configService';
import { of } from 'rxjs/internal/observable/of';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DeleteTranslationsService } from '../../services/deleteTranslationsService';
import { CopyTranslationsService } from '../../services/copyTranslationsService';
import { TeacherProjectTranslationService } from '../../services/teacherProjectTranslationService';
import { RemoveNodeIdFromTransitionsService } from '../../services/removeNodeIdFromTransitionsService';
import { BranchService } from '../../services/branchService';
import { PathService } from '../../services/pathService';
import { ComponentServiceLookupService } from '../../services/componentServiceLookupService';
import { MockProviders } from 'ng-mocks';
import { ConstraintService } from '../../services/constraintService';
import { ProjectService } from '../../services/projectService';
import { Node } from '../../common/Node';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

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
      imports: [
        NodeIconAndTitleComponent,
        ProjectAuthoringComponent,
        ProjectAuthoringLessonComponent,
        ProjectAuthoringStepComponent
      ],
      providers: [
        BranchService,
        ClassroomStatusService,
        MockProviders(
          ComponentServiceLookupService,
          ConstraintService,
          ProjectService,
          TeacherDataService
        ),
        ConfigService,
        CopyNodesService,
        CopyTranslationsService,
        DeleteNodeService,
        DeleteTranslationsService,
        MoveNodesService,
        PathService,
        provideRouter([]),
        RemoveNodeIdFromTransitionsService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        TeacherWebSocketService,
        provideHttpClient(withInterceptorsFromDi())
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
    spyOn(TestBed.inject(ProjectService), 'getNode').and.returnValue(new Node());
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
