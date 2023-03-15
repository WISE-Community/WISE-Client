import { TestBed } from '@angular/core/testing';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';
import { ConstraintService } from '../../assets/wise5/services/constraintService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentDataService } from '../../assets/wise5/services/studentDataService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { Constraint } from '../domain/constraint';
import { Observable, Subject } from 'rxjs';

class MockProjectService {
  private projectParsedSource: Subject<void> = new Subject<void>();
  public projectParsed$: Observable<void> = this.projectParsedSource.asObservable();
  getFlattenedProjectAsNodeIds() {}
  getNodeById(nodeId: string) {
    if (nodeId.startsWith('node')) {
      return { id: nodeId, type: 'node' };
    } else if (nodeId.startsWith('group')) {
      return { id: nodeId, type: 'group' };
    } else {
      return null;
    }
  }
  isNodeDescendentOfGroup(node: any, targetNode: any): boolean {
    return (
      ((node.id === nodeId1 || node.id === nodeId2) && targetNode.id === groupId1) ||
      ((node.id === nodeId3 || node.id === nodeId4) && targetNode.id === groupId2) ||
      ((node.id === nodeId5 || node.id === nodeId6) && targetNode.id === groupId3)
    );
  }
  isNodeIdAfter(nodeId1: string, nodeId2: string): boolean {
    return nodeId1 < nodeId2;
  }
}

let configService: ConfigService;
let criteria1: any;
let criteria2: any;
let dataService: StudentDataService;
const groupId1 = 'group1';
const groupId2 = 'group2';
const groupId3 = 'group3';
let nodeConstraintTwoRemovalCriteria: any;
const nodeId1 = 'node1';
const nodeId2 = 'node2';
const nodeId3 = 'node3';
const nodeId4 = 'node4';
const nodeId5 = 'node5';
const nodeId6 = 'node6';
let projectService: ProjectService;
let service: ConstraintService;

describe('ConstraintService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      providers: [{ provide: ProjectService, useClass: MockProjectService }]
    });
    configService = TestBed.inject(ConfigService);
    dataService = TestBed.inject(StudentDataService);
    projectService = TestBed.inject(ProjectService);
    service = TestBed.inject(ConstraintService);
    criteria1 = {
      name: 'isCompleted',
      params: {
        nodeId: nodeId1
      }
    };
    criteria2 = {
      name: 'isCompleted',
      params: {
        nodeId: nodeId2
      }
    };
    nodeConstraintTwoRemovalCriteria = {
      id: 'node3Constraint1',
      action: '',
      targetId: nodeId3,
      removalCriteria: [criteria1, criteria2],
      removalConditional: 'all'
    };
  });
  evaluateNodeConstraint();
  evaluateCriterias();
  getConstraintsThatAffectNode();
  orderConstraints();
});

function evaluateNodeConstraint() {
  describe('evaluateNodeConstraint()', () => {
    evaluateNodeConstraintWithOneRemovalCriteria();
    evaluateNodeConstraintWithTwoRemovalCriteria();
  });
}

function evaluateNodeConstraintWithOneRemovalCriteria() {
  it('should evaluate node constraint with one removal criteria', () => {
    spyOn(dataService, 'isCompleted').and.returnValue(true);
    const constraint = {
      id: 'node1Constraint1',
      action: '',
      targetId: nodeId1,
      removalCriteria: [criteria1],
      removalConditional: 'all'
    };
    expect(service.evaluateNodeConstraint(constraint)).toEqual(true);
  });
}

function evaluateNodeConstraintWithTwoRemovalCriteria() {
  function isCompletedSpy(): void {
    spyOn(dataService, 'isCompleted')
      .withArgs(nodeId1)
      .and.returnValue(true)
      .withArgs(nodeId2)
      .and.returnValue(false);
  }
  it('should evaluate node constraint with two removal criteria requiring all', () => {
    isCompletedSpy();
    expect(service.evaluateNodeConstraint(nodeConstraintTwoRemovalCriteria)).toEqual(false);
  });
  it('should evaluate node constraint with two removal criteria requiring any', () => {
    isCompletedSpy();
    nodeConstraintTwoRemovalCriteria.removalConditional = 'any';
    expect(service.evaluateNodeConstraint(nodeConstraintTwoRemovalCriteria)).toEqual(true);
  });
}

function evaluateCriterias() {
  describe('evaluateCriterias()', () => {
    it('should evaluate criterias when it is passed one criteria that is false', () => {
      const criterias = [criteria1];
      spyOn(dataService, 'isCompleted').and.returnValue(false);
      expect(service.evaluateCriterias(criterias)).toEqual(false);
    });
    it('should evaluate criterias when it is passed one criteria that is true', () => {
      const criterias = [criteria1];
      spyOn(dataService, 'isCompleted').and.returnValue(true);
      expect(service.evaluateCriterias(criterias)).toEqual(true);
    });
    it('should evaluate criterias when it is passed multiple criterias and one is false', () => {
      const criterias = [criteria1, criteria2];
      spyOn(dataService, 'isCompleted')
        .withArgs(nodeId1)
        .and.returnValue(true)
        .withArgs(nodeId2)
        .and.returnValue(false);
      expect(service.evaluateCriterias(criterias)).toEqual(false);
    });
  });
}

function getConstraintsThatAffectNode() {
  let constraint1: Constraint;
  let constraint2: Constraint;
  let constraint3: Constraint;
  describe('getConstraintsThatAffectNode()', () => {
    beforeEach(() => {
      spyOn(configService, 'getConfigParam').and.returnValue(true);
      constraint1 = new Constraint({
        id: 'constraint1',
        action: 'makeAllNodesAfterThisNotVisible',
        targetId: nodeId5
      });
      constraint2 = new Constraint({
        id: 'constraint2',
        action: 'makeThisNodeNotVisitable',
        targetId: nodeId2
      });
      constraint3 = new Constraint({
        id: 'constraint3',
        action: 'makeThisNodeNotVisitable',
        targetId: groupId2
      });
      service.activeConstraints = [constraint1, constraint2, constraint3];
    });
    it(`should get the constraints that affect the node when there are no constraints that affect
        the node`, () => {
      expect(service.getConstraintsThatAffectNode({ id: nodeId1 })).toEqual([]);
    });
    it(`should get the constraints that affect the node when there is a node after constraint that
        affects the node`, () => {
      expect(service.getConstraintsThatAffectNode({ id: nodeId6 })).toEqual([constraint1]);
    });
    it(`should get the constraints that affect the node when the node is the target`, () => {
      expect(service.getConstraintsThatAffectNode({ id: nodeId2 })).toEqual([constraint2]);
    });
    it(`should get the constraints that affect the node when the node is a child of the
        target`, () => {
      expect(service.getConstraintsThatAffectNode({ id: nodeId4 })).toEqual([constraint3]);
    });
  });
}

function orderConstraints() {
  describe('orderConstraints()', () => {
    it('should order constraints', () => {
      spyOn(projectService, 'getFlattenedProjectAsNodeIds').and.returnValue([
        nodeId1,
        nodeId2,
        nodeId3
      ]);
      const constraint1 = new Constraint({ targetId: nodeId2 });
      const constraint2 = new Constraint({ targetId: nodeId3 });
      const constraint3 = new Constraint({ targetId: nodeId1 });
      const constraints = [constraint1, constraint2, constraint3];
      const orderedConstraints = service.orderConstraints(constraints);
      expect(orderedConstraints).toEqual([constraint3, constraint1, constraint2]);
    });
  });
}
