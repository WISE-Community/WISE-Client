import { Annotation } from '../../../common/Annotation';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

let component: IdeasSummaryComponent;
let fixture: ComponentFixture<IdeasSummaryComponent>;

describe('IdeasSummaryComponent for Dialog Guidance component', () => {
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
    component.componentType = 'DialogGuidance';
  });

  beforeEach(() => {
    const configService = TestBed.inject(ConfigService);
    spyOn(configService, 'isPreview').and.returnValue(false);
    spyOn(configService, 'isAuthoring').and.returnValue(false);
    spyOn(configService, 'isStudentRun').and.returnValue(false);
    spyOn(configService, 'getNumberOfWorkgroupsInPeriod').and.returnValue(1);
    spyOn(configService, 'getClassmateUserInfos').and.returnValue([
      { workgroupId: 1, displayNames: 'Student 1' }
    ]);
  });

  describe('ngOnInit()', () => {
    ngInit_DG_NoIdeasDetected_ShowMessage();
    ngInit_DG_IdeasDetected_ShowSummary();
  });

  describe('table interactions', () => {
    beforeEach(() => {
      generateMockRubricWithTags();
      generateMockStudentWorkDialogGuidanceWithResponses();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('renders the ideas table with search and headers', () => {
      expect(fixture.nativeElement.querySelector('table')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('input[matInput]')).toBeTruthy();
      const headers = fixture.nativeElement.querySelectorAll('th');
      expect(headers.length).toBe(3);
      expect(headers[0].textContent).toContain('Idea');
      expect(headers[1].textContent).toContain('Students');
      expect(headers[2].textContent).toContain('Category');
    });

    it('omits the Category column when no rubric ideas have tags', () => {
      const ideasWithoutTags = [
        new CRaterIdea('idea 1', true, 'Solar radiation enters car'),
        new CRaterIdea('idea 2', true, 'Car is warmer than outside'),
        new CRaterIdea('idea 3', true, 'Heat is trapped in car')
      ];
      (TestBed.inject(CRaterService).getCRaterRubric as jasmine.Spy).and.returnValue(
        new CRaterRubric({ ideas: ideasWithoutTags })
      );
      component.ngOnInit();
      fixture.detectChanges();

      expect(component['displayedColumns']).toEqual(['text', 'count']);
      const headers = fixture.nativeElement.querySelectorAll('th');
      expect(headers.length).toBe(2);
      expect(headers[0].textContent).toContain('Idea');
      expect(headers[1].textContent).toContain('Students');
      const headerTexts = Array.from(headers).map((th: any) => th.textContent);
      expect(headerTexts.some((text: string) => text.includes('Category'))).toBe(false);
    });

    it('displays unique label for ideas with count <= 2', () => {
      const uniqueLabel = fixture.nativeElement.querySelector('.unique-label');
      expect(uniqueLabel).toBeTruthy();
      expect(uniqueLabel.textContent.trim()).toBe('unique');
    });

    it('provides keyboard accessibility attributes on table rows', () => {
      const rows = fixture.nativeElement.querySelectorAll('tr.idea-row');
      expect(rows.length).toBe(3);

      // Active rows (count > 0) have tabIndex=0, aria-expanded=false, aria-disabled=false
      expect(rows[0].getAttribute('tabindex')).toBe('0');
      expect(rows[0].getAttribute('aria-expanded')).toBe('false');
      expect(rows[0].getAttribute('aria-disabled')).toBe('false');

      // Disabled row (count === 0) has tabIndex=-1, no aria-expanded, aria-disabled=true
      const disabledRow = fixture.nativeElement.querySelector('tr.idea-row.disabled-row');
      expect(disabledRow.getAttribute('tabindex')).toBe('-1');
      expect(disabledRow.getAttribute('aria-expanded')).toBeNull();
      expect(disabledRow.getAttribute('aria-disabled')).toBe('true');
    });

    it('toggles row expansion on Enter key', () => {
      const rowData = component['dataSource'].data[0];
      expect(component['isExpanded'](rowData)).toBe(false);

      const rows = fixture.nativeElement.querySelectorAll('tr.idea-row');
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
      spyOn(enterEvent, 'preventDefault').and.callThrough();

      rows[0].dispatchEvent(enterEvent);
      fixture.detectChanges();

      expect(enterEvent.preventDefault).toHaveBeenCalled();
      expect(component['isExpanded'](rowData)).toBe(true);
      expect(rows[0].getAttribute('aria-expanded')).toBe('true');
    });

    it('toggles row expansion on Space key and prevents default scroll', () => {
      const rowData = component['dataSource'].data[0];
      expect(component['isExpanded'](rowData)).toBe(false);

      const rows = fixture.nativeElement.querySelectorAll('tr.idea-row');
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
      spyOn(spaceEvent, 'preventDefault').and.callThrough();

      rows[0].dispatchEvent(spaceEvent);
      fixture.detectChanges();

      expect(spaceEvent.preventDefault).toHaveBeenCalled();
      expect(component['isExpanded'](rowData)).toBe(true);
    });

    it('does not expand disabled row on Enter or Space key', () => {
      const idea3Row = component['dataSource'].data.find((row) => row.id === 'idea 3');
      expect(idea3Row.count).toBe(0);

      const disabledRow = fixture.nativeElement.querySelector('tr.idea-row.disabled-row');
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
      disabledRow.dispatchEvent(enterEvent);
      fixture.detectChanges();

      expect(component['isExpanded'](idea3Row)).toBe(false);
    });

    it('allows multi-row expansion to show student responses', () => {
      const rows = component['dataSource'].data;
      expect(rows.length).toBeGreaterThan(0);

      // Initially no rows expanded
      expect(component['expandedIdeaIds'].size).toBe(0);

      // Toggle first row
      component['toggleRow'](rows[0]);
      expect(component['isExpanded'](rows[0])).toBe(true);

      // Toggle second row (both should now be expanded)
      if (rows.length > 1) {
        component['toggleRow'](rows[1]);
        expect(component['isExpanded'](rows[0])).toBe(true);
        expect(component['isExpanded'](rows[1])).toBe(true);
        expect(component['expandedIdeaIds'].size).toBe(2);
      }

      // Collapse first row
      component['toggleRow'](rows[0]);
      expect(component['isExpanded'](rows[0])).toBe(false);
    });

    it('filters ideas by idea text', () => {
      component['searchQuery'] = 'radiation';
      component['applyFilter']();
      fixture.detectChanges();
      expect(
        component['dataSource'].filteredData.every((row) =>
          row.text.toLowerCase().includes('radiation')
        )
      ).toBe(true);
    });

    it('filters ideas by category tag', () => {
      component['searchQuery'] = 'mechanistic';
      component['applyFilter']();
      fixture.detectChanges();
      expect(
        component['dataSource'].filteredData.every((row) =>
          row.tags.some((t) => t.name.toLowerCase().includes('mechanistic'))
        )
      ).toBe(true);
    });

    it('filters ideas by student response text', () => {
      component['searchQuery'] = 'warms the car';
      component['applyFilter']();
      fixture.detectChanges();
      expect(
        component['dataSource'].filteredData.every((row) =>
          row.responses.some((r) => r.text.toLowerCase().includes('warms the car'))
        )
      ).toBe(true);
    });

    it('shows all responses for a student that contain the same idea', () => {
      const multiStates = [
        new ComponentState({
          workgroupId: 1,
          studentData: {
            responses: [
              { text: 'First response with idea 1', timestamp: 100 },
              { ideas: [{ name: 'idea 1', detected: true }] },
              { text: 'Second response with idea 1', timestamp: 200 },
              { ideas: [{ name: 'idea 1', detected: true }] }
            ]
          }
        })
      ];
      const dgResponses = component['getDGResponsesWithIdea'](multiStates, 'idea 1');
      expect(dgResponses.length).toBe(1);
      expect(dgResponses[0].texts).toEqual([
        'First response with idea 1',
        'Second response with idea 1'
      ]);
    });

    it('renders disabled rows for ideas with 0 student responses that are not expandable', () => {
      const idea3Row = component['dataSource'].data.find((row) => row.id === 'idea 3');
      expect(idea3Row).toBeTruthy();
      expect(idea3Row.count).toBe(0);
      expect(component['isUnique'](idea3Row)).toBe(false);

      component['toggleRow'](idea3Row);
      expect(component['isExpanded'](idea3Row)).toBe(false);
      expect(component['expandedIdeaIds'].has('idea 3')).toBe(false);

      const disabledRows = fixture.nativeElement.querySelectorAll('tr.disabled-row');
      expect(disabledRows.length).toBe(1);
      expect(disabledRows[0].textContent).toContain('Heat is trapped in car');
    });
  });
});

describe('IdeasSummaryComponent for Open Response component', () => {
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
    component.componentType = 'OpenResponse';
  });

  beforeEach(() => {
    const configService = TestBed.inject(ConfigService);
    spyOn(configService, 'isPreview').and.returnValue(false);
    spyOn(configService, 'isAuthoring').and.returnValue(false);
    spyOn(configService, 'isStudentRun').and.returnValue(false);
    spyOn(configService, 'getNumberOfWorkgroupsInPeriod').and.returnValue(1);
    spyOn(configService, 'getClassmateUserInfos').and.returnValue([
      { workgroupId: 1, displayNames: 'Student 1' }
    ]);
  });

  describe('ngOnInit()', () => {
    ngInit_OR_NoIdeasDetected_ShowMessage();
    ngInit_OR_IdeasDetected_ShowSummary();
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
    expect(fixture.nativeElement.querySelector('table')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Student Ideas Detected');
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

function generateMockRubricWithTags(): void {
  const ideas = [
    new CRaterIdea('idea 1', true, 'Solar radiation enters car', ['mechanistic']),
    new CRaterIdea('idea 2', true, 'Car is warmer than outside', ['descriptive']),
    new CRaterIdea('idea 3', true, 'Heat is trapped in car', ['mechanistic'])
  ];
  const ideaColors = [
    { tags: ['mechanistic'], colorValue: '#fed7aa' },
    { tags: ['descriptive'], colorValue: '#bfdbfe' }
  ];
  spyOn(TestBed.inject(CRaterService), 'getCRaterRubric').and.returnValue(
    new CRaterRubric({ ideas: ideas, ideaColors: ideaColors })
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

function generateMockStudentWorkDialogGuidanceWithResponses(): void {
  spyOn(TestBed.inject(SummaryService), 'getLatestClassmateStudentWork').and.returnValue(
    of([
      new ComponentState({
        workgroupId: 1,
        studentData: {
          responses: [
            { text: 'It warms the car up.', timestamp: 12345 },
            { ideas: [{ name: 'idea 1', detected: true }] },
            { text: 'Inside is warmer.', timestamp: 12346 },
            { ideas: [{ name: 'idea 2', detected: true }] }
          ]
        }
      })
    ])
  );
}

function generateMockStudentWorkOpenResponse(numIdeasDetected: number): void {
  const ideas = generateIdeas(numIdeasDetected);
  spyOn(TestBed.inject(AnnotationService), 'getAnnotationsByNodeIdComponentId').and.returnValue([
    new Annotation({
      toWorkgroupId: 1,
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
