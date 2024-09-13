import { TestBed } from '@angular/core/testing';
import { EditBranchService } from '../../assets/wise5/services/editBranchService';
import { copy } from '../../assets/wise5/common/object/object';
import oneBranchTwoPaths_project_import from './sampleData/curriculum/OneBranchTwoPaths.project.json';
import { TeacherProjectService } from '../../assets/wise5/services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Transition } from '../../assets/wise5/common/Transition';
import { TransitionLogic } from '../../assets/wise5/common/TransitionLogic';
import { ConstraintRemovalCriteria } from '../../assets/wise5/common/ConstraintRemovalCriteria';
import { RANDOM_VALUE } from '../domain/branchCriteria';
import { ConstraintRemovalCriteriaParams } from '../../assets/wise5/common/ConstraintRemovalCriteriaParams';
import { expectConstraint, expectTransitionLogic } from './branchServiceTestHelperFunctions';
import { DeleteBranchService } from '../../assets/wise5/services/deleteBranchService';

const ENTER_NODE: string = 'enterNode';

const branchStepId: string = 'node2';
const canChangePath: boolean = false;
let branchProjectJSON: any;
let http: HttpClient;
const maxPathsVisitable: number = 1;
const mergeStepId: string = 'node8';
const path1NodeId: string = 'node3';
const path2NodeId: string = 'node5';
const path3NodeId: string = 'node9';
const pathCount: number = 2;
let projectService: TeacherProjectService;
let service: EditBranchService;
let saveProjectSpy;

describe('EditBranchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule],
      providers: [
        EditBranchService,
        DeleteBranchService,
        provideHttpClient(withInterceptorsFromDi()),
        TeacherProjectService
      ]
    });
    branchProjectJSON = copy(oneBranchTwoPaths_project_import);
    http = TestBed.inject(HttpClient);
    projectService = TestBed.inject(TeacherProjectService);
    service = TestBed.inject(EditBranchService);
    projectService.setProject(branchProjectJSON);
    saveProjectSpy = spyOn(projectService, 'saveProject').and.returnValue(new Promise(() => {}));
  });
  editBranch();
  addBranchPath();
});

function editBranch() {
  describe('editBranch()', () => {
    it('adds a path to an existing branch', () => {
      const node = {
        id: 'node2',
        title: 'Branch point',
        type: 'node',
        transitionLogic: {
          transitions: [
            {
              to: 'node3'
            },
            {
              to: 'node5'
            }
          ],
          howToChooseAmongAvailablePaths: 'random',
          whenToChoosePath: 'enterNode',
          canChangePath: false,
          maxPathsVisitable: 1
        }
      };
      const branchPaths = [
        {
          nodesInBranchPath: [
            {
              order: 4,
              nodeId: 'node3'
            },
            {
              order: 5,
              nodeId: 'node4'
            }
          ],
          transition: {
            to: 'node3'
          }
        },
        {
          nodesInBranchPath: [
            {
              order: 6,
              nodeId: 'node5'
            },
            {
              order: 7,
              nodeId: 'node6'
            },
            {
              order: 8,
              nodeId: 'node7'
            }
          ],
          transition: {
            to: 'node5'
          }
        },
        {
          new: true,
          nodesInBranchPath: []
        }
      ];
      const params = {
        branchStepId: 'node2',
        criteria: 'random',
        mergeStepId: 'node8',
        pathCount: 2
      };
      service.editBranch(node, branchPaths, params);
      expectPathStepsToHaveTransitions(['node4', 'node7', 'node9'], mergeStepId);
      expectPathStepsToHaveConstraints([path1NodeId, path2NodeId, path3NodeId], branchStepId);
      expect(saveProjectSpy).toHaveBeenCalled();
    });
  });
}

function addBranchPath() {
  describe('addBranchPath()', () => {
    it('adds a new path at the end', () => {
      service.addBranchPath(2, {
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
      expectPathStepsToHaveTransitions(['node4', 'node7', 'node9'], mergeStepId);
      expectPathStepsToHaveConstraints([path1NodeId, path2NodeId, path3NodeId], branchStepId);
    });
  });
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
