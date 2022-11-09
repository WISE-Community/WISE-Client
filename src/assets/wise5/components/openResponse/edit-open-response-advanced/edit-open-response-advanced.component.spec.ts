import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditCommonAdvancedComponent } from '../../../../../app/authoring-tool/edit-common-advanced/edit-common-advanced.component';
import { EditComponentAddToNotebookButtonComponent } from '../../../../../app/authoring-tool/edit-component-add-to-notebook-button/edit-component-add-to-notebook-button.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../../../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentRubricComponent } from '../../../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../../../../../app/authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../../../../../app/authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../../../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../../common/ComponentContent';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditOpenResponseAdvancedComponent } from './edit-open-response-advanced.component';

let component: EditOpenResponseAdvancedComponent;
let fixture: ComponentFixture<EditOpenResponseAdvancedComponent>;
const scoringRule1 = createScoringRuleObject(1, 'You got 1 point');
const scoringRule2 = createScoringRuleObject(2, 'You got 2 points');
const scoringRule3 = createScoringRuleObject(3, 'You got 3 points');

describe('EditOpenResponseAdvancedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [
        EditComponentAddToNotebookButtonComponent,
        EditCommonAdvancedComponent,
        EditComponentExcludeFromTotalScoreComponent,
        EditComponentJsonComponent,
        EditComponentMaxScoreComponent,
        EditComponentRubricComponent,
        EditComponentSaveButtonComponent,
        EditComponentSubmitButtonComponent,
        EditComponentTagsComponent,
        EditComponentWidthComponent,
        EditConnectedComponentsAddButtonComponent,
        EditConnectedComponentsComponent,
        EditOpenResponseAdvancedComponent
      ],
      providers: [TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      {} as ComponentContent
    );
    spyOn(TestBed.inject(NotebookService), 'isNotebookEnabled').and.returnValue(true);
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      'node1',
      'node2',
      'node3'
    ]);
    fixture = TestBed.createComponent(EditOpenResponseAdvancedComponent);
    component = fixture.componentInstance;
    spyOn(component, 'setShowSubmitButtonValue').and.callFake(() => {});
    spyOn(component, 'componentChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  enableCRaterClicked();
  addScoringRule();
  scoringRuleDeleteClicked();
  addMultipleAttemptScoringRule();
  multipleAttemptScoringRuleDeleteClicked();
  addNotification();
  notificationDeleteClicked();
  enableMultipleAttemptScoringRulesClicked();
  enableNotificationsClicked();
  useCustomCompletionCriteriaClicked();
  addCompletionCriteria();
  deleteCompletionCriteria();
  setFeedbackEnabled();
});

function enableCRaterClicked() {
  describe('enableCRaterClicked', () => {
    it('should handle enable CRater clicked', () => {
      expect(component.authoringComponentContent.cRater).toBeUndefined();
      component.authoringComponentContent.enableCRater = true;
      component.enableCRaterClicked();
      expect(component.authoringComponentContent.cRater).toEqual(component.createCRaterObject());
    });
  });
}

function addScoringRule() {
  describe('addScoringRule', () => {
    it('should add scoring rule', () => {
      component.authoringComponentContent.cRater = component.createCRaterObject();
      component.addScoringRule();
      expect(component.authoringComponentContent.cRater.scoringRules.length).toEqual(1);
      expect(component.authoringComponentContent.cRater.scoringRules[0]).toEqual(
        component.createScoringRule()
      );
    });
  });
}

function createScoringRuleObject(score: number, feedbackText: string): any {
  return {
    feedbackText: feedbackText,
    score: score
  };
}

function scoringRuleDeleteClicked() {
  describe('scoringRuleDeleteClicked', () => {
    it('should handle moving a scoring rule down', () => {
      component.authoringComponentContent.cRater = component.createCRaterObject();
      component.authoringComponentContent.cRater.scoringRules = [
        scoringRule1,
        scoringRule2,
        scoringRule3
      ];
      spyOn(window, 'confirm').and.returnValue(true);
      component.scoringRuleDeleteClicked(1);
      expect(component.authoringComponentContent.cRater.scoringRules.length).toEqual(2);
      expect(component.authoringComponentContent.cRater.scoringRules[0]).toEqual(scoringRule1);
      expect(component.authoringComponentContent.cRater.scoringRules[1]).toEqual(scoringRule3);
    });
  });
}

function addMultipleAttemptScoringRule() {
  describe('addMultipleAttemptScoringRule', () => {
    it('should add a multiple attempt scoring rule', () => {
      component.authoringComponentContent.cRater = component.createCRaterObject();
      component.addMultipleAttemptScoringRule();
      expect(component.authoringComponentContent.cRater.multipleAttemptScoringRules.length).toEqual(
        1
      );
      expect(component.authoringComponentContent.cRater.multipleAttemptScoringRules[0]).toEqual(
        component.createMultipleAttemptScoringRule()
      );
    });
  });
}

function multipleAttemptScoringRuleDeleteClicked() {
  describe('multipleAttemptScoringRuleDeleteClicked', () => {
    it('should delete a multiple attempt scoring rule', () => {
      component.authoringComponentContent.cRater = component.createCRaterObject();
      const multipleAttemptScoringRule1 = createMultipleAttemptScoringRule(
        1,
        1,
        'You got a 1 and then a 1'
      );
      const multipleAttemptScoringRule2 = createMultipleAttemptScoringRule(
        1,
        2,
        'You got a 1 and then a 2'
      );
      const multipleAttemptScoringRule3 = createMultipleAttemptScoringRule(
        1,
        3,
        'You got a 1 and then a 3'
      );
      component.authoringComponentContent.cRater.multipleAttemptScoringRules = [
        multipleAttemptScoringRule1,
        multipleAttemptScoringRule2,
        multipleAttemptScoringRule3
      ];
      spyOn(window, 'confirm').and.returnValue(true);
      component.multipleAttemptScoringRuleDeleteClicked(1);
      expect(component.authoringComponentContent.cRater.multipleAttemptScoringRules.length).toEqual(
        2
      );
      expect(component.authoringComponentContent.cRater.multipleAttemptScoringRules[0]).toEqual(
        multipleAttemptScoringRule1
      );
      expect(component.authoringComponentContent.cRater.multipleAttemptScoringRules[1]).toEqual(
        multipleAttemptScoringRule3
      );
    });
  });
}

function createMultipleAttemptScoringRule(
  previousScore: number,
  currentScore: number,
  feedbackText: string
): any {
  return {
    scoreSequence: [previousScore, currentScore],
    feedbackText: feedbackText
  };
}

function enableNotificationsClicked() {
  describe('enableNotificationsClicked', () => {
    it('should enable notifications', () => {
      component.authoringComponentContent.cRater = component.createCRaterObject();
      component.authoringComponentContent.enableNotifications = true;
      component.enableNotificationsClicked();
      expect(component.authoringComponentContent.notificationSettings).toBeDefined();
      expect(component.authoringComponentContent.notificationSettings.notifications.length).toEqual(
        0
      );
    });
  });
}

function enableMultipleAttemptScoringRulesClicked() {
  describe('enableMultipleAttemptScoringRulesClicked', () => {
    it('should enable multiple attempt scoring rules', () => {
      component.authoringComponentContent.enableNotifications = true;
      component.enableNotificationsClicked();
      expect(component.authoringComponentContent.notificationSettings).toBeDefined();
      expect(component.authoringComponentContent.notificationSettings.notifications).toBeDefined();
      expect(component.authoringComponentContent.notificationSettings.notifications.length).toEqual(
        0
      );
    });
  });
}

function addNotification() {
  describe('addNotification', () => {
    it('should add a notification', () => {
      component.authoringComponentContent.cRater = component.createCRaterObject();
      component.authoringComponentContent.notificationSettings = {
        notifications: []
      };
      component.addNotification();
      expect(component.authoringComponentContent.notificationSettings.notifications.length).toEqual(
        1
      );
      expect(component.authoringComponentContent.notificationSettings.notifications[0]).toEqual(
        component.createNotification()
      );
    });
  });
}

function notificationDeleteClicked() {
  describe('notificationDeleteClicked', () => {
    it('should delete a notification', () => {
      component.authoringComponentContent.cRater = component.createCRaterObject();
      component.authoringComponentContent.notificationSettings = {
        notifications: [
          component.createNotification(),
          component.createNotification(),
          component.createNotification()
        ]
      };
      component.authoringComponentContent.notificationSettings.notifications[0].dismissCode = 'a';
      component.authoringComponentContent.notificationSettings.notifications[1].dismissCode = 'b';
      component.authoringComponentContent.notificationSettings.notifications[2].dismissCode = 'c';
      spyOn(window, 'confirm').and.returnValue(true);
      component.notificationDeleteClicked(1);
      expect(component.authoringComponentContent.notificationSettings.notifications.length).toEqual(
        2
      );
      expect(
        component.authoringComponentContent.notificationSettings.notifications[0].dismissCode
      ).toEqual('a');
      expect(
        component.authoringComponentContent.notificationSettings.notifications[1].dismissCode
      ).toEqual('c');
    });
  });
}

function useCustomCompletionCriteriaClicked() {
  describe('useCustomCompletionCriteriaClicked', () => {
    it('should turn on custom completion criteria', () => {
      component.useCustomCompletionCriteria = false;
      component.useCustomCompletionCriteriaClicked({});
      expect(component.authoringComponentContent.completionCriteria).toEqual(
        component.createCompletionCriteria()
      );
    });
    it('should turn off custom completion criteria', () => {
      component.useCustomCompletionCriteria = true;
      spyOn(window, 'confirm').and.returnValue(true);
      component.authoringComponentContent.completionCriteria = component.createCompletionCriteria();
      component.useCustomCompletionCriteriaClicked({});
      expect(component.authoringComponentContent.completionCriteria).toBeUndefined();
    });
  });
}

function addCompletionCriteria() {
  describe('addCompletionCriteria', () => {
    it('should add a completion criteria', () => {
      component.authoringComponentContent = {
        completionCriteria: {
          criteria: []
        }
      };
      component.addCompletionCriteria();
      expect(component.authoringComponentContent.completionCriteria.criteria.length).toEqual(1);
    });
  });
}

function createCompletionCriteriaObject(nodeId: string, componentId: string, name: string): any {
  return {
    componentId: componentId,
    name: name,
    nodeId: nodeId
  };
}

function deleteCompletionCriteria() {
  describe('deleteCompletionCriteria', () => {
    it('should delete a completion criteria', () => {
      const completionCriteria1 = createCompletionCriteriaObject(
        'node1',
        'component1',
        'isSubmitted'
      );
      const completionCriteria2 = createCompletionCriteriaObject(
        'node2',
        'component2',
        'isSubmitted'
      );
      const completionCriteria3 = createCompletionCriteriaObject(
        'node3',
        'component3',
        'isSubmitted'
      );
      component.authoringComponentContent = {
        completionCriteria: {
          criteria: [completionCriteria1, completionCriteria2, completionCriteria3]
        }
      };
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteCompletionCriteria(1);
      expect(component.authoringComponentContent.completionCriteria.criteria.length).toEqual(2);
      expect(component.authoringComponentContent.completionCriteria.criteria[0]).toEqual(
        completionCriteria1
      );
      expect(component.authoringComponentContent.completionCriteria.criteria[1]).toEqual(
        completionCriteria3
      );
    });
  });
}

function setFeedbackEnabled() {
  describe('setFeedbackEnabled()', () => {
    it('should initialize feedback settings and set enabled field', () => {
      component.authoringComponentContent.cRater = {};
      component.setFeedbackEnabled(true);
      expect(component.authoringComponentContent.cRater.feedback.enabled).toBeTruthy();
      expect(component.authoringComponentContent.cRater.feedback.rules.length).toEqual(1);
    });
  });
}
