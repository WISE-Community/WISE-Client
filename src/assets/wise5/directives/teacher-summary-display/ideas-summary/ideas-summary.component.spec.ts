import { AnnotationService } from '../../../services/annotationService';
import { ComponentFixture } from '@angular/core/testing';
import { ComponentState } from '../../../../../app/domain/componentState';
import { ConfigService } from '../../../services/configService';
import { CRaterIdea } from '../../../components/common/cRater/CRaterIdea';
import { CRaterRubric } from '../../../components/common/cRater/CRaterRubric';
import { CRaterService } from '../../../services/cRaterService';
import { IdeasSummaryComponent } from './ideas-summary.component';
import { MockProviders } from 'ng-mocks';
import { of } from 'rxjs';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TestBed } from '@angular/core/testing';
import { Annotation } from '../../../common/Annotation';
import { IdeaSummaryComponent } from '../idea-summary/idea-summary.component';
import { MockComponent } from 'ng-mocks';

let component: IdeasSummaryComponent;
let fixture: ComponentFixture<IdeasSummaryComponent>;
describe('IdeasSummaryComponent for Dialog Guidance component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasSummaryComponent, MockComponent(IdeaSummaryComponent)],
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
    component.componentType = 'DialogGuidance';
  });
  beforeEach(() => {
    const configService = TestBed.inject(ConfigService);
    spyOn(configService, 'isPreview').and.returnValue(false);
    spyOn(configService, 'isAuthoring').and.returnValue(false);
    spyOn(configService, 'isStudentRun').and.returnValue(false);
    spyOn(configService, 'getNumberOfWorkgroupsInPeriod').and.returnValue(1);
  });

  describe('ngOnChanges()', () => {
    ngInit_DG_NoIdeasDetected_ShowMessage();
    ngInit_DG_IdeasDetected_ShowSummary();
    ngInit_DG_ManyIdeasDetected_ShowTopAndBottomThree();
  });
});

describe('IdeasSummaryComponent for Open Response component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasSummaryComponent, MockComponent(IdeaSummaryComponent)],
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
    component.componentType = 'OpenResponse';
  });
  beforeEach(() => {
    const configService = TestBed.inject(ConfigService);
    spyOn(configService, 'isPreview').and.returnValue(false);
    spyOn(configService, 'isAuthoring').and.returnValue(false);
    spyOn(configService, 'isStudentRun').and.returnValue(false);
    spyOn(configService, 'getNumberOfWorkgroupsInPeriod').and.returnValue(1);
  });

  describe('ngOnChanges()', () => {
    ngInit_OR_NoIdeasDetected_ShowMessage();
    ngInit_OR_IdeasDetected_ShowSummary();
    ngInit_OR_ManyIdeasDetected_ShowTopAndBottomThree();
    ngInit_OR_FilterByPeriod();
  });
});

function ngInit_DG_NoIdeasDetected_ShowMessage() {
  describe('no ideas detected', () => {
    beforeEach(() => {
      generateMockRubric(3, 0);
      generateMockStudentWorkDialogGuidance(0);
    });
    showMessageToTeacher('DG');
  });
}

function ngInit_OR_NoIdeasDetected_ShowMessage() {
  describe('no ideas detected', () => {
    beforeEach(() => {
      generateMockRubric(3, 0);
      generateMockStudentWorkOpenResponse(0);
    });
    showMessageToTeacher('OR');
  });
}

function showMessageToTeacher(componentType: string) {
  it('shows message to teacher (' + componentType + ')', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      "Your students' ideas will show up here as they are detected in the activity."
    );
  });
}

function ngInit_DG_IdeasDetected_ShowSummary() {
  describe('ideas detected', () => {
    beforeEach(() => {
      generateMockRubric(3, 1);
      generateMockStudentWorkDialogGuidance(1);
    });
    showsDisplaySummary('DG');
  });
}

function ngInit_OR_IdeasDetected_ShowSummary() {
  describe('ideas detected', () => {
    beforeEach(() => {
      generateMockRubric(3, 1);
      generateMockStudentWorkOpenResponse(1);
    });
    showsDisplaySummary('OR');
  });
}

function showsDisplaySummary(componentType: string) {
  it('shows summary display (' + componentType + ')', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h3').textContent).toEqual('Most Common');
  });
}

function ngInit_DG_ManyIdeasDetected_ShowTopAndBottomThree() {
  describe('more than 3 ideas detected', () => {
    beforeEach(() => {
      generateMockRubric(4, 4);
      generateMockStudentWorkDialogGuidance(4);
    });
    onlyShowThreeIdeas('DG');
  });
}

function ngInit_OR_ManyIdeasDetected_ShowTopAndBottomThree() {
  describe('more than 3 ideas detected', () => {
    beforeEach(() => {
      generateMockRubric(4, 4);
      generateMockStudentWorkOpenResponse(4);
    });
    onlyShowThreeIdeas('OR');
  });
}

function onlyShowThreeIdeas(componentType: string) {
  xit('shows only top and bottom three ideas (' + componentType + ')', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('#most-common-ideas > li').length).toEqual(3);
    expect(fixture.nativeElement.querySelectorAll('#least-common-ideas > li').length).toEqual(3);
  });
}

function generateMockRubric(numIdeas: number, numDetected: number): void {
  const ideas = [];
  for (let i = 0; i < numIdeas; i++) {
    const idea = new CRaterIdea('idea ' + (i + 1), numDetected > 0 ? true : false);
    ideas.push(idea);
    numDetected--;
  }
  spyOn(TestBed.inject(CRaterService), 'getCRaterRubric').and.returnValue(
    new CRaterRubric({ ideas: ideas })
  );
}

function generateMockStudentWorkDialogGuidance(numIdeasDetected: number): void {
  const ideas = generateIdeas(numIdeasDetected);
  spyOn(TestBed.inject(SummaryService), 'getLatestClassmateStudentWork').and.returnValue(
    of([
      new ComponentState({
        workgroupId: 1,
        studentData: { responses: [{ ideas: ideas }] }
      })
    ])
  );
}

function generateMockStudentWorkOpenResponse(numIdeasDetected: number): void {
  const ideas = generateIdeas(numIdeasDetected);
  spyOn(TestBed.inject(AnnotationService), 'getAnnotationsByNodeIdComponentId').and.returnValue([
    new Annotation({
      workgroupId: 1,
      data: { ideas: ideas }
    })
  ]);
}

function generateIdeas(numIdeas: number) {
  const ideas = [];
  for (let i = 0; i < numIdeas; i++) {
    ideas.push({ name: 'idea ' + (i + 1), detected: true });
  }
  return ideas;
}

function ngInit_OR_FilterByPeriod() {
  describe('filtering by period', () => {
    beforeEach(() => {
      generateMockRubric(1, 1);
      const ideas = generateIdeas(1);
      spyOn(TestBed.inject(AnnotationService), 'getAnnotationsByNodeIdComponentId').and.returnValue(
        [
          new Annotation({ periodId: 1, data: { ideas: ideas }, toWorkgroupId: 1 } as any),
          new Annotation({ periodId: 1, data: { ideas: ideas }, toWorkgroupId: 1 } as any),
          new Annotation({ periodId: 2, data: { ideas: ideas }, toWorkgroupId: 2 } as any)
        ]
      );
    });

    it('includes all latest annotations for workgroups when period is "All Periods" (-1)', () => {
      component.periodId = -1;
      spyOn<any>(component, 'groupIdeas');
      component.ngOnInit();
      const summaryData = (component as any).groupIdeas.calls.mostRecent().args[0];
      expect(summaryData.dataPoints.length).toEqual(2);
    });

    it('includes only annotations for the selected period', () => {
      component.periodId = 1;
      spyOn<any>(component, 'groupIdeas');
      component.ngOnInit();
      const summaryData = (component as any).groupIdeas.calls.mostRecent().args[0];
      expect(summaryData.dataPoints.length).toEqual(1);
    });
  });
}
