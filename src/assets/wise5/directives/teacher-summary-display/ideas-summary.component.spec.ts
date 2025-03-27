import { AnnotationService } from '../../services/annotationService';
import { ComponentFixture } from '@angular/core/testing';
import { ComponentState } from '../../../../app/domain/componentState';
import { ConfigService } from '../../services/configService';
import { CRaterIdea } from '../../components/common/cRater/CRaterIdea';
import { CRaterRubric } from '../../components/common/cRater/CRaterRubric';
import { CRaterService } from '../../services/cRaterService';
import { IdeasSummaryComponent } from './ideas-summary.component';
import { MockProviders } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { SummaryService } from '../../components/summary/summaryService';
import { TeacherDataService } from '../../services/teacherDataService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TestBed } from '@angular/core/testing';

let component: IdeasSummaryComponent;
let fixture: ComponentFixture<IdeasSummaryComponent>;
describe('IdeasSummaryDisplayComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasSummaryComponent],
      providers: [
        MockProviders(
          AnnotationService,
          ConfigService,
          CRaterService,
          TeacherDataService,
          TeacherProjectService,
          SummaryService
        )
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IdeasSummaryComponent);
    component = fixture.componentInstance;
    component.doRender = true;
  });
  beforeEach(() => {
    spyOn(TestBed.inject(ConfigService), 'isPreview').and.returnValue(false);
    spyOn(TestBed.inject(ConfigService), 'isAuthoring').and.returnValue(false);
    spyOn(TestBed.inject(ConfigService), 'isStudentRun').and.returnValue(false);
    spyOn(TestBed.inject(ConfigService), 'getNumberOfWorkgroupsInPeriod').and.returnValue(1);
  });
  ngOnInit();
});

function ngOnInit() {
  describe('ngOnChanges()', () => {
    ngInit_NoIdeasDetected_ShowMessage();
    ngInit_IdeasDetected_ShowSummary();
    ngInit_ManyIdeasDetected_ShowTopAndBottomThree();
  });
}

function ngInit_NoIdeasDetected_ShowMessage() {
  describe('no ideas detected', () => {
    beforeEach(() => {
      spyOn(TestBed.inject(CRaterService), 'getCRaterRubric').and.returnValue(
        generateMockRubric(3, 0)
      );
      spyOn(TestBed.inject(SummaryService), 'getLatestClassmateStudentWork').and.returnValue(
        generateMockStudentWork(0)
      );
    });
    it('shows message to teacher', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.notice').textContent).toContain(
        "Your students' ideas will show up here as they are detected in the dialog."
      );
    });
  });
}

function ngInit_IdeasDetected_ShowSummary() {
  describe('ideas detected', () => {
    beforeEach(() => {
      spyOn(TestBed.inject(CRaterService), 'getCRaterRubric').and.returnValue(
        generateMockRubric(3, 1)
      );
      spyOn(TestBed.inject(SummaryService), 'getLatestClassmateStudentWork').and.returnValue(
        generateMockStudentWork(1)
      );
    });
    it('shows summary display', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h3').textContent).toEqual('Most Common:');
    });
  });
}

function ngInit_ManyIdeasDetected_ShowTopAndBottomThree() {
  describe('more than 3 ideas detected', () => {
    beforeEach(() => {
      spyOn(TestBed.inject(CRaterService), 'getCRaterRubric').and.returnValue(
        generateMockRubric(4, 4)
      );
      spyOn(TestBed.inject(SummaryService), 'getLatestClassmateStudentWork').and.returnValue(
        generateMockStudentWork(4)
      );
    });
    it('shows only top and bottom three ideas', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('#most-common-ideas > li').length).toEqual(3);
      expect(fixture.nativeElement.querySelectorAll('#least-common-ideas > li').length).toEqual(3);
    });
  });
}

function generateMockRubric(numIdeas: number, numDetected: number): CRaterRubric {
  const ideas = [];
  for (let i = 0; i < numIdeas; i++) {
    const idea = new CRaterIdea('idea ' + (i + 1), numDetected > 0 ? true : false);
    ideas.push(idea);
    numDetected--;
  }
  return new CRaterRubric({ ideas: ideas });
}

function generateMockStudentWork(numIdeasDetected: number): Observable<ComponentState[]> {
  const ideas = [];
  for (let i = 0; i < numIdeasDetected; i++) {
    ideas.push({ name: 'idea ' + (i + 1), detected: true });
  }
  return of([
    new ComponentState({
      workgroupId: 1,
      studentData: { responses: [{ ideas: ideas }] }
    })
  ]);
}
