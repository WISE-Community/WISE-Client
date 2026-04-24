import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { NodeAdvancedPathAuthoringComponent } from './node-advanced-path-authoring.component';
import { MockProvider } from 'ng-mocks';
import { Node } from '../../../../common/Node';

describe('NodeAdvancedPathAuthoringComponent', () => {
  let component: NodeAdvancedPathAuthoringComponent;
  let fixture: ComponentFixture<NodeAdvancedPathAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeAdvancedPathAuthoringComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeAdvancedPathAuthoringComponent);
    component = fixture.componentInstance;
    const teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'getFlattenedProjectAsNodeIds').and.returnValue([]);
    const transitionLogic = {
      transitions: []
    };
    component['node'] = {
      transitionLogic: transitionLogic
    };
    const node = new Node();
    node.transitionLogic = transitionLogic;
    spyOn(teacherProjectService, 'getNode').and.returnValue(node);
    fixture.detectChanges();
  });

  function addNewTransition() {
    it('should add new transition', () => {
      expect(component.node.transitionLogic.transitions.length).toEqual(0);
      component.addNewTransition();
      expect(component.node.transitionLogic.transitions.length).toEqual(1);
    });
  }

  function deleteTransition() {
    it('should delete a transition', () => {
      component.addNewTransition();
      expect(component.node.transitionLogic.transitions.length).toEqual(1);
      const transition = component.node.transitionLogic.transitions[0];
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteTransition(transition);
    });
  }

  function addNewTransitionCriteria() {
    it('should add new transition criteria', () => {
      component.addNewTransition();
      const transition = component.node.transitionLogic.transitions[0];
      expect(transition.criteria).toBeUndefined();
      component.addNewTransitionCriteria(transition);
      expect(transition.criteria.length).toEqual(1);
      component.addNewTransitionCriteria(transition);
      expect(transition.criteria.length).toEqual(2);
    });
  }

  function deleteTransitionCriteria() {
    it('should delete transition criteria', () => {
      component.addNewTransition();
      const transition = component.node.transitionLogic.transitions[0];
      component.addNewTransitionCriteria(transition);
      expect(transition.criteria.length).toEqual(1);
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteTransitionCriteria(transition, 0);
      expect(transition.criteria.length).toEqual(0);
    });
  }

  addNewTransition();
  deleteTransition();
  addNewTransitionCriteria();
  deleteTransitionCriteria();
});
