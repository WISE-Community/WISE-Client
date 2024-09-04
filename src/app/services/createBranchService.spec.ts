import { TestBed } from '@angular/core/testing';
import { CreateBranchService } from '../../assets/wise5/services/createBranchService';
import { copy } from '../../assets/wise5/common/object/object';
import demoProjectJSON_import from './sampleData/curriculum/Demo.project.json';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ConfigService } from '../../assets/wise5/services/configService';
import { Transition } from '../../assets/wise5/common/Transition';
import { TransitionLogic } from '../../assets/wise5/common/TransitionLogic';
import { TransitionCriteria } from '../../assets/wise5/common/TransitionCriteria';
import { ConstraintRemovalCriteria } from '../../assets/wise5/common/ConstraintRemovalCriteria';
import {
  CHOICE_CHOSEN_VALUE,
  RANDOM_VALUE,
  SCORE_VALUE,
  WORKGROUP_ID_VALUE
} from '../domain/branchCriteria';
import { ConstraintRemovalCriteriaParams } from '../../assets/wise5/common/ConstraintRemovalCriteriaParams';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogWithSpinnerComponent } from '../../assets/wise5/directives/dialog-with-spinner/dialog-with-spinner.component';

const ENTER_NODE: string = 'enterNode';
const RANDOM: string = 'random';
const STUDENT_DATA_CHANGED: string = 'studentDataChanged';

const branchStepId: string = 'node3';
const canChangePath: boolean = false;
let configService: ConfigService;
let demoProjectJSON: any;
let http: HttpClient;
const maxPathsVisitable: number = 1;
const mergeStepId: string = 'node4';
const path1NodeId: string = 'node806';
const path2NodeId: string = 'node807';
const path3NodeId: string = 'node808';
const pathCount: number = 3;
let projectService: TeacherProjectService;
let service: CreateBranchService;

describe('CreateBranchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogWithSpinnerComponent],
      imports: [
        HttpClientTestingModule,
        MatProgressSpinnerModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [CreateBranchService, TeacherProjectService]
    });
    demoProjectJSON = copy(demoProjectJSON_import);
    configService = TestBed.inject(ConfigService);
    http = TestBed.inject(HttpClient);
    projectService = TestBed.inject(TeacherProjectService);
    service = TestBed.inject(CreateBranchService);
    configService.setConfig({ canEditProject: true });
    projectService.setProject(demoProjectJSON);
    spyOn(configService, 'getMyUserInfo').and.returnValue({
      userId: 4,
      firstName: 'Spongebob',
      lastName: 'Squarepants',
      username: 'spongebobsquarepants'
    });
    spyOn(http, 'post').and.returnValue(of({}));
  });
  createBranch();
});

function createBranch() {
  describe('create branch', () => {
    createBranchBasedOnWorkgroupId();
    createBranchBasedOnRandom();
    createBranchBasedOnScore();
    createBranchBasedOnChoiceChosen();
    createBranchAndNewMergeStep();
  });
}

function createBranchBasedOnWorkgroupId() {
  describe('with workgroup id params', () => {
    it('creates a branch based on workgroup id', async () => {
      await service.createBranch({
        branchStepId: branchStepId,
        criteria: WORKGROUP_ID_VALUE,
        mergeStepId: mergeStepId,
        pathCount: pathCount
      });
      expectTransitionLogic(
        projectService.getNodeById(branchStepId),
        new TransitionLogic({
          canChangePath: canChangePath,
          howToChooseAmongAvailablePaths: WORKGROUP_ID_VALUE,
          maxPathsVisitable: maxPathsVisitable,
          transitions: [
            new Transition(path1NodeId),
            new Transition(path2NodeId),
            new Transition(path3NodeId)
          ],
          whenToChoosePath: ENTER_NODE
        })
      );
      expectPathStepsToHaveTransitions([path1NodeId, path2NodeId, path3NodeId], mergeStepId);
      expectPathStepsToHaveConstraints([path1NodeId, path2NodeId, path3NodeId], branchStepId);
    });
  });
}

function createBranchBasedOnRandom() {
  describe('with random params', () => {
    it('creates a branch based on random', async () => {
      await service.createBranch({
        branchStepId: branchStepId,
        criteria: RANDOM_VALUE,
        mergeStepId: mergeStepId,
        pathCount: pathCount
      });
      expectTransitionLogic(
        projectService.getNodeById(branchStepId),
        new TransitionLogic({
          canChangePath: canChangePath,
          howToChooseAmongAvailablePaths: RANDOM_VALUE,
          maxPathsVisitable: maxPathsVisitable,
          transitions: [
            new Transition(path1NodeId),
            new Transition(path2NodeId),
            new Transition(path3NodeId)
          ],
          whenToChoosePath: ENTER_NODE
        })
      );
      expectPathStepsToHaveTransitions([path1NodeId, path2NodeId, path3NodeId], mergeStepId);
      expectPathStepsToHaveConstraints([path1NodeId, path2NodeId, path3NodeId], branchStepId);
    });
  });
}

function createBranchBasedOnScore() {
  describe('with score params', () => {
    it('creates a branch based on score', async () => {
      const componentId: string = '0sef5ya2wj';
      const criteria: string = SCORE_VALUE;
      const score1: string = '1';
      const score2: string = '2';
      const score3: string = '3';
      await service.createBranch({
        branchStepId: branchStepId,
        componentId: componentId,
        criteria: criteria,
        mergeStepId: mergeStepId,
        nodeId: branchStepId,
        pathCount: pathCount,
        paths: [score1, score2, score3]
      });
      expectTransitionLogic(
        projectService.getNodeById(branchStepId),
        new TransitionLogic({
          canChangePath: canChangePath,
          howToChooseAmongAvailablePaths: RANDOM,
          maxPathsVisitable: maxPathsVisitable,
          transitions: [
            new Transition(path1NodeId, [
              new TransitionCriteria(criteria, {
                componentId: componentId,
                nodeId: branchStepId,
                scores: [score1]
              })
            ]),
            new Transition(path2NodeId, [
              new TransitionCriteria(criteria, {
                componentId: componentId,
                nodeId: branchStepId,
                scores: [score2]
              })
            ]),
            new Transition(path3NodeId, [
              new TransitionCriteria(criteria, {
                componentId: componentId,
                nodeId: branchStepId,
                scores: [score3]
              })
            ])
          ],
          whenToChoosePath: STUDENT_DATA_CHANGED
        })
      );
      expectPathStepsToHaveTransitions([path1NodeId, path2NodeId, path3NodeId], mergeStepId);
      expectPathStepsToHaveConstraints([path1NodeId, path2NodeId, path3NodeId], branchStepId);
    });
  });
}

function createBranchBasedOnChoiceChosen() {
  describe('with choice chosen params', () => {
    it('creates a branch based on choice chosen', async () => {
      const branchStepId: string = 'node5';
      const componentId: string = '09hahe7wsm';
      const mergeStepId: string = 'node6';
      const criteria: string = CHOICE_CHOSEN_VALUE;
      const choice1Id: string = 'y6rvd7eziz';
      const choice2Id: string = 'ti5rd0es02';
      const choice3Id: string = 'gb0cnkaiem';
      await service.createBranch({
        branchStepId: branchStepId,
        componentId: componentId,
        criteria: criteria,
        mergeStepId: mergeStepId,
        nodeId: branchStepId,
        pathCount: pathCount,
        paths: [choice1Id, choice2Id, choice3Id]
      });
      expectTransitionLogic(
        projectService.getNodeById(branchStepId),
        new TransitionLogic({
          canChangePath: canChangePath,
          howToChooseAmongAvailablePaths: RANDOM,
          maxPathsVisitable: maxPathsVisitable,
          transitions: [
            new Transition(path1NodeId, [
              new TransitionCriteria(criteria, {
                componentId: componentId,
                nodeId: branchStepId,
                choiceIds: [choice1Id]
              })
            ]),
            new Transition(path2NodeId, [
              new TransitionCriteria(criteria, {
                componentId: componentId,
                nodeId: branchStepId,
                choiceIds: [choice2Id]
              })
            ]),
            new Transition(path3NodeId, [
              new TransitionCriteria(criteria, {
                componentId: componentId,
                nodeId: branchStepId,
                choiceIds: [choice3Id]
              })
            ])
          ],
          whenToChoosePath: STUDENT_DATA_CHANGED
        })
      );
      expectPathStepsToHaveTransitions([path1NodeId, path2NodeId, path3NodeId], mergeStepId);
      expectPathStepsToHaveConstraints([path1NodeId, path2NodeId, path3NodeId], branchStepId);
    });
  });
}

function createBranchAndNewMergeStep() {
  describe('with a new merge step', () => {
    it('creates a branch and a new merge step', async () => {
      const criteria = WORKGROUP_ID_VALUE;
      await service.createBranch({
        branchStepId: branchStepId,
        criteria: criteria,
        mergeStepId: '',
        pathCount: pathCount
      });
      expectTransitionLogic(
        projectService.getNodeById(branchStepId),
        new TransitionLogic({
          canChangePath: canChangePath,
          howToChooseAmongAvailablePaths: criteria,
          maxPathsVisitable: maxPathsVisitable,
          transitions: [
            new Transition(path1NodeId),
            new Transition(path2NodeId),
            new Transition(path3NodeId)
          ],
          whenToChoosePath: ENTER_NODE
        })
      );
      expectPathStepsToHaveTransitions([path1NodeId, path2NodeId, path3NodeId], 'node809');
      expectPathStepsToHaveConstraints([path1NodeId, path2NodeId, path3NodeId], branchStepId);
    });
  });
}

function expectTransitionLogic(node: any, transitionLogic: TransitionLogic) {
  expect(copy(node.transitionLogic)).toEqual(copy(transitionLogic));
}

function expectPathStepsToHaveTransitions(newNodeIds: string[], mergeStepId: string) {
  for (const newNodeId of newNodeIds) {
    expectTransitionLogic(
      projectService.getNodeById(newNodeId),
      new TransitionLogic({ transitions: [new Transition(mergeStepId)] })
    );
  }
}

function expectPathStepsToHaveConstraints(newNodeIds: string[], branchStepId: string) {
  for (const newNodeId of newNodeIds) {
    const node = projectService.getNodeById(newNodeId);
    expectConstraint(node.constraints[0], 'makeThisNodeNotVisible', newNodeId, [
      new ConstraintRemovalCriteria(
        'branchPathTaken',
        new ConstraintRemovalCriteriaParams({
          fromNodeId: branchStepId,
          toNodeId: newNodeId
        })
      )
    ]);
    expectConstraint(node.constraints[1], 'makeThisNodeNotVisitable', newNodeId, [
      new ConstraintRemovalCriteria(
        'branchPathTaken',
        new ConstraintRemovalCriteriaParams({
          fromNodeId: branchStepId,
          toNodeId: newNodeId
        })
      )
    ]);
  }
}

function expectConstraint(
  constraint: any,
  expectedAction: string,
  expectedTargetId: string,
  expectedRemovalCriteria: any[]
) {
  expect(constraint.action).toEqual(expectedAction);
  expect(constraint.targetId).toEqual(expectedTargetId);
  for (let i = 0; i < expectedRemovalCriteria.length; i++) {
    expect(copy(constraint.removalCriteria[i])).toEqual(copy(expectedRemovalCriteria[i]));
  }
}
