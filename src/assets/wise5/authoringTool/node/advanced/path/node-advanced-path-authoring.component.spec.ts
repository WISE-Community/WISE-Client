import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import { NodeAdvancedPathAuthoringComponent } from './node-advanced-path-authoring.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { NodeAdvancedAuthoringComponent } from '../node-advanced-authoring/node-advanced-authoring.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NodeAdvancedPathAuthoringComponent', () => {
  let component: NodeAdvancedPathAuthoringComponent;
  let fixture: ComponentFixture<NodeAdvancedPathAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NodeAdvancedAuthoringComponent, NodeAdvancedPathAuthoringComponent],
    imports: [MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule],
    providers: [
        ClassroomStatusService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        {
            provide: ActivatedRoute,
            useValue: {
                parent: { parent: { params: of({ nodeId: 'node1' }) } }
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeAdvancedPathAuthoringComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue(
      []
    );
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue({
      transitionLogic: {
        transitions: []
      }
    });
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
      expect(component.node.transitionLogic.transitions.length).toEqual(0);
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
