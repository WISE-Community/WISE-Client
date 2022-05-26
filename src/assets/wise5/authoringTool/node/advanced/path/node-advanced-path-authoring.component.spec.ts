import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UpgradeModule } from '@angular/upgrade/static';
import { AchievementService } from '../../../../services/achievementService';
import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { NotificationService } from '../../../../services/notificationService';
import { ProjectService } from '../../../../services/projectService';
import { SessionService } from '../../../../services/sessionService';
import { StudentDataService } from '../../../../services/studentDataService';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import { UtilService } from '../../../../services/utilService';
import { NodeAdvancedPathAuthoringComponent } from './node-advanced-path-authoring.component';
import { MatDialogModule } from '@angular/material/dialog';

describe('NodeAdvancedPathAuthoringComponent', () => {
  let component: NodeAdvancedPathAuthoringComponent;
  let fixture: ComponentFixture<NodeAdvancedPathAuthoringComponent>;
  const nodeId1 = 'node1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        UpgradeModule
      ],
      declarations: [NodeAdvancedPathAuthoringComponent],
      providers: [
        AchievementService,
        AnnotationService,
        ClassroomStatusService,
        ConfigService,
        NotificationService,
        ProjectService,
        SessionService,
        StudentDataService,
        TagService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        UtilService
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
