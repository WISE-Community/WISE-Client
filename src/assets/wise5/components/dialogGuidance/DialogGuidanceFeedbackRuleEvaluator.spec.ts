import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { PossibleScoreComponent } from '../../../../app/possible-score/possible-score.component';
import { ComponentHeader } from '../../directives/component-header/component-header.component';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { CRaterService } from '../../services/cRaterService';
import { NodeService } from '../../services/nodeService';
import { NotebookService } from '../../services/notebookService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentAssetService } from '../../services/studentAssetService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { UtilService } from '../../services/utilService';
import { MockNodeService } from '../animation/animation-authoring/animation-authoring.component.spec';
import { MockService } from '../animation/animation-student/animation-student.component.spec';
import { ComponentService } from '../componentService';
import { CRaterIdea } from './CRaterIdea';
import { CRaterResponse } from './CRaterResponse';
import { DialogGuidanceStudentComponent } from './dialog-guidance-student/dialog-guidance-student.component';
import { DialogResponsesComponent } from './dialog-responses/dialog-responses.component';
import { DialogGuidanceFeedbackRuleEvaluator } from './DialogGuidanceFeedbackRuleEvaluator';
import { DialogGuidanceService } from './dialogGuidanceService';

let component: DialogGuidanceStudentComponent;
let evaluator: DialogGuidanceFeedbackRuleEvaluator;
describe('DialogGuidanceFeedbackRuleEvaluator', () => {
  let fixture: ComponentFixture<DialogGuidanceStudentComponent>;
  const defaultFeedbackRules = [
    {
      rule: ['isFinalSubmit'],
      feedback: 'This is a generic response that is shown on a final submission'
    },
    {
      rule: ['isSecondToLastSubmit'],
      feedback: 'This is a generic response that is shown on the second to last submission'
    },
    {
      rule: ['idea1'],
      feedback: 'You hit idea 1'
    },
    {
      rule: ['idea2'],
      feedback: 'You hit idea 2'
    },
    {
      rule: ['isDefault'],
      feedback: 'This is a default feedback'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ComponentHeader,
        DialogGuidanceStudentComponent,
        DialogResponsesComponent,
        PossibleScoreComponent
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        UpgradeModule
      ],
      providers: [
        AnnotationService,
        ComponentService,
        CRaterService,
        ConfigService,
        DialogGuidanceService,
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockService },
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceStudentComponent);
    spyOn(TestBed.inject(AnnotationService), 'getLatestComponentAnnotations').and.returnValue({
      score: 0,
      comment: ''
    });
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    component = fixture.componentInstance;
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    component.componentContent = TestBed.inject(DialogGuidanceService).createComponent();
    component.componentContent.feedbackRules = defaultFeedbackRules;
    fixture.detectChanges();
    evaluator = new DialogGuidanceFeedbackRuleEvaluator(component);
  });
  matchRule();
  matchNoRule_ReturnDefault();
  secondToLastSubmit();
  finalSubmit();
});

function matchRule() {
  it('should find first rule matching rule', () => {
    const rule = getFeedbackRuleForIdeas(['idea1']);
    expect(rule.feedback).toContain('You hit idea 1');
  });
}

function matchNoRule_ReturnDefault() {
  it('should return default idea when no rule is matched', () => {
    const rule = getFeedbackRuleForIdeas([]);
    expect(rule.feedback).toContain('default feedback');
  });
}

function secondToLastSubmit() {
  it('should return second to last submit rule when there is one submit left', () => {
    component.componentContent.maxSubmitCount = 5;
    component.submitCounter = 4;
    const rule = getFeedbackRuleForIdeas(['idea1']);
    expect(rule.feedback).toContain('second to last submission');
  });
}

function finalSubmit() {
  it('should return final submit rule when no more submits left', () => {
    component.componentContent.maxSubmitCount = 5;
    component.submitCounter = 5;
    const rule = getFeedbackRuleForIdeas(['idea1']);
    expect(rule.feedback).toContain('final submission');
  });
}

function getFeedbackRuleForIdeas(ideasString: string[]) {
  const response = createCRaterResponse(ideasString);
  return evaluator.getFeedbackRule(response);
}

function createCRaterResponse(ideasString: string[]) {
  const response = new CRaterResponse();
  response.ideas = ideasString.map((idea) => {
    const cRaterIdea = new CRaterIdea();
    cRaterIdea.name = idea;
    cRaterIdea.detected = true;
    return cRaterIdea;
  });
  return response;
}
