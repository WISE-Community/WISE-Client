import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentSummaryComponent } from './component-summary.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockComponents, MockProvider, MockProviders } from 'ng-mocks';
import { MilestoneReportButtonComponent } from '../milestone-report-button/milestone-report-button.component';
import { ComponentCompletionComponent } from '../component-completion/component-completion.component';
import { By } from '@angular/platform-browser';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { CRaterService } from '../../../services/cRaterService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { SummaryService } from '../../../components/summary/summaryService';
import { PeerGroupButtonComponent } from '../peer-group-button/peer-group-button.component';
import { ProjectService } from '../../../services/projectService';
import { DiscussionAiSummaryComponent } from '../../../directives/teacher-summary-display/discussion-ai-summary/discussion-ai-summary.component';
import { DiscussionSummaryComponent } from '../../../directives/teacher-summary-display/discussion-summary/discussion-summary.component';
import { IdeasSummaryComponent } from '../../../directives/teacher-summary-display/ideas-summary/ideas-summary.component';
import { MatchSummaryDisplayComponent } from '../../../directives/teacher-summary-display/match-summary-display/match-summary-display.component';
import { OpenResponseAiSummaryComponent } from '../../../directives/teacher-summary-display/open-response-ai-summary/open-response-ai-summary.component';
import { TeacherReflectionComponent } from '../../../teacher-reflection/teacher-reflection.component';
import { TeacherSummaryDisplayComponent } from '../../../directives/teacher-summary-display/teacher-summary-display.component';

let component: ComponentSummaryComponent;
let fixture: ComponentFixture<ComponentSummaryComponent>;
describe('ComponentSummaryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComponentSummaryComponent,
        MockComponents(
          ComponentCompletionComponent,
          DiscussionAiSummaryComponent,
          DiscussionSummaryComponent,
          IdeasSummaryComponent,
          MatchSummaryDisplayComponent,
          MilestoneReportButtonComponent,
          OpenResponseAiSummaryComponent,
          PeerGroupButtonComponent,
          TeacherReflectionComponent,
          TeacherSummaryDisplayComponent
        )
      ],
      providers: [
        MockProviders(
          AnnotationService,
          ComponentServiceLookupService,
          CRaterService,
          ProjectService,
          SummaryService
        ),
        MockProvider(TeacherDataService, {
          currentPeriodChanged$: of({ currentPeriod: { periodId: 1 } })
        }),
        { provide: ActivatedRoute, useValue: { parent: { params: of({ nodeId: 'node1' }) } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentSummaryComponent);
    component = fixture.componentInstance;
    component.node = { id: 'node1', title: 'Node 1' } as any;
    component.component = { id: 'abc', prompt: 'hi' } as any;
    fixture.detectChanges();
  });
  testHasStudentWork();
  testNoStudentWork();
  testSummaryPriorityAndSizing();
});

function testHasStudentWork() {
  describe('has student work', () => {
    beforeEach(() => {
      component['hasStudentWork'] = true;
      fixture.detectChanges();
    });
    it('should show component completion', () => {
      expect(getComponentCompletion()).toBeTruthy();
    });
  });
}

function testNoStudentWork() {
  describe('no student work', () => {
    beforeEach(() => {
      component['hasStudentWork'] = false;
      fixture.detectChanges();
    });
    it('should not show component completion', () => {
      expect(getComponentCompletion()).toBeFalsy();
    });
  });
}

function testSummaryPriorityAndSizing() {
  describe('summary priority and sizing', () => {
    it('should render OpenResponse summaries in priority order with large and small size classes', () => {
      component.periodId = 1;
      component.component = {
        id: 'abc',
        type: 'OpenResponse',
        prompt: 'hi',
        teacher: { reflectionQuestions: [{ id: 'q1', text: 'Reflect' }] }
      } as any;
      component['hasStudentWork'] = true;
      component['showSummary'] = true;
      component['hasIdeaRubricData'] = true;
      component['showScoreSummary'] = true;
      component['aiEnabled'] = true;
      fixture.detectChanges();

      const grid = fixture.debugElement.query(By.css('.summaries'));
      expect(grid).toBeTruthy();
      const children = Array.from(grid.nativeElement.children) as HTMLElement[];
      expect(children.length).toBe(4);

      expect(children[0].classList).toContain('summary-lg');
      expect(children[0].classList).toContain('order-1');
      expect(children[0].querySelector('ideas-summary')).toBeTruthy();

      expect(children[1].classList).toContain('summary-sm');
      expect(children[1].classList).toContain('order-3');
      expect(children[1].querySelector('teacher-summary-display')).toBeTruthy();

      expect(children[2].classList).toContain('summary-sm');
      expect(children[2].classList).toContain('order-4');
      expect(children[2].querySelector('open-response-ai-summary')).toBeTruthy();

      expect(children[3].classList).toContain('summary-lg');
      expect(children[3].classList).toContain('order-5');
      expect(children[3].querySelector('teacher-reflection')).toBeTruthy();
    });
  });
}

function getComponentCompletion() {
  return fixture.debugElement.query(By.css('component-completion'));
}
