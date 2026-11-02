import { Annotation } from '../../../common/Annotation';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';
import { ComponentState } from '../../../../../app/domain/componentState';
import { ConfigService } from '../../../services/configService';
import { CRaterIdea } from '../../../components/common/cRater/CRaterIdea';
import { CRaterRubric } from '../../../components/common/cRater/CRaterRubric';
import { CRaterService } from '../../../services/cRaterService';
import {
  IdeaTableRow,
  IdeasSummaryComponent,
  StudentResponseItem
} from './ideas-summary.component';
import { MockProvider, MockProviders } from 'ng-mocks';
import { NEVER, of } from 'rxjs';
import { SummaryService } from '../../../components/summary/summaryService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherPresentationConfigService } from '../../../teacher-presentation/services/teacher-presentation-config.service';
import { TeacherPresentationSelectionStore } from '../../../teacher-presentation/state/teacher-presentation-selection.store';

let component: IdeasSummaryComponent;
let fixture: ComponentFixture<IdeasSummaryComponent>;

describe('IdeasSummaryComponent for Dialog Guidance component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasSummaryComponent],
      providers: [
        MockProviders(ConfigService, CRaterService, TeacherDataService, SummaryService),
        MockProvider(TeacherPresentationConfigService, {
          getConfig: () => of(null as any),
          saveConfig: () => of({} as any)
        }),
        MockProvider(TeacherProjectService, {
          projectSaved$: NEVER
        }),
        MockProvider(AnnotationService, {
          annotationReceived$: NEVER
        })
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
      generateMockRubricForTable();
      generateMockStudentWorkDialogGuidanceWithResponses();
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('renders the ideas table with search and headers', () => {
      expect(component['displayedColumns']).toEqual(['text', 'sampleResponse', 'count']);
      expect(fixture.nativeElement.querySelector('table')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('input[matInput]')).toBeTruthy();
      const headers = fixture.nativeElement.querySelectorAll('th');
      expect(headers.length).toBe(3);
      expect(headers[0].textContent).toContain('Idea');
      expect(headers[1].textContent.trim()).toBe('');
      expect(headers[1].getAttribute('aria-label')).toBe('Sample response');
      expect(headers[2].textContent).toContain('Students');
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

    it('filters ideas by student response text', () => {
      component['searchQuery'] = 'warms the car';
      component['applyFilter']();
      fixture.detectChanges();
      expect(component['dataSource'].filteredData.length).toBeGreaterThan(0);
      expect(
        component['dataSource'].filteredData.every((row) =>
          row.responses.some((r) => r.text.toLowerCase().includes('warms the car'))
        )
      ).toBe(true);
    });

    it('logs IdeasSummaryRowToggled when row is expanded and collapsed', () => {
      const teacherDataService = TestBed.inject(TeacherDataService);
      const saveEventSpy = spyOn(teacherDataService, 'saveEvent').and.callFake(() =>
        Promise.resolve([])
      );
      component.nodeId = 'node1';
      component.componentId = 'comp1';
      component.componentType = 'DialogGuidance';

      const rows = component['dataSource'].data;
      component['toggleRow'](rows[0]);

      expect(saveEventSpy).toHaveBeenCalledWith(
        'ClassroomMonitor',
        'node1',
        'comp1',
        'DialogGuidance',
        'TeacherSummary',
        'IdeasSummaryRowToggled',
        {
          ideaId: rows[0].id,
          expanded: true,
          studentCount: rows[0].count,
          isUnique: component['isUnique'](rows[0])
        }
      );

      component['toggleRow'](rows[0]);

      expect(saveEventSpy).toHaveBeenCalledWith(
        'ClassroomMonitor',
        'node1',
        'comp1',
        'DialogGuidance',
        'TeacherSummary',
        'IdeasSummaryRowToggled',
        {
          ideaId: rows[0].id,
          expanded: false,
          studentCount: rows[0].count,
          isUnique: component['isUnique'](rows[0])
        }
      );
    });

    it('logs IdeasSummarySortChanged when sort changes', () => {
      const teacherDataService = TestBed.inject(TeacherDataService);
      const saveEventSpy = spyOn(teacherDataService, 'saveEvent').and.callFake(() =>
        Promise.resolve([])
      );
      component.nodeId = 'node1';
      component.componentId = 'comp1';
      component.componentType = 'DialogGuidance';

      component['sort'].sortChange.emit({ active: 'count', direction: 'desc' });

      expect(saveEventSpy).toHaveBeenCalledWith(
        'ClassroomMonitor',
        'node1',
        'comp1',
        'DialogGuidance',
        'TeacherSummary',
        'IdeasSummarySortChanged',
        {
          column: 'count',
          direction: 'desc'
        }
      );
    });

    it('logs IdeasSummaryFilterChanged after debounce when filter is applied', fakeAsync(() => {
      const teacherDataService = TestBed.inject(TeacherDataService);
      const saveEventSpy = spyOn(teacherDataService, 'saveEvent').and.callFake(() =>
        Promise.resolve([])
      );
      component.nodeId = 'node1';
      component.componentId = 'comp1';
      component.componentType = 'DialogGuidance';

      component['searchQuery'] = 'radiation';
      component['applyFilter']();
      tick(2000);

      expect(saveEventSpy).toHaveBeenCalledWith(
        'ClassroomMonitor',
        'node1',
        'comp1',
        'DialogGuidance',
        'TeacherSummary',
        'IdeasSummaryFilterChanged',
        jasmine.objectContaining({
          query: 'radiation',
          resultCount: jasmine.any(Number)
        })
      );
    }));

    describe('sorting', () => {
      it('keeps ideas with 0 students below ideas with at least 1 student when sorted ascending', () => {
        const testData: IdeaTableRow[] = [
          {
            id: '1',
            text: 'Idea 1',
            count: 0,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          },
          {
            id: '2',
            text: 'Idea 2',
            count: 5,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          },
          {
            id: '3',
            text: 'Idea 3',
            count: 1,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          },
          {
            id: '4',
            text: 'Idea 4',
            count: 0,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          },
          {
            id: '5',
            text: 'Idea 5',
            count: 3,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          }
        ];

        const sortedAsc = component['dataSource'].sortData(testData.slice(), {
          active: 'count',
          direction: 'asc'
        } as any);

        expect(sortedAsc.map((r) => r.count)).toEqual([1, 3, 5, 0, 0]);
      });

      it('keeps ideas with 0 students below ideas with at least 1 student when sorted descending', () => {
        const testData: IdeaTableRow[] = [
          {
            id: '1',
            text: 'Idea 1',
            count: 0,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          },
          {
            id: '2',
            text: 'Idea 2',
            count: 5,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          },
          {
            id: '3',
            text: 'Idea 3',
            count: 1,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          },
          {
            id: '4',
            text: 'Idea 4',
            count: 0,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          },
          {
            id: '5',
            text: 'Idea 5',
            count: 3,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          }
        ];

        const sortedDesc = component['dataSource'].sortData(testData.slice(), {
          active: 'count',
          direction: 'desc'
        } as any);

        expect(sortedDesc.map((r) => r.count)).toEqual([5, 3, 1, 0, 0]);
      });

      it('sorts by text when sorting by idea column', () => {
        const testData: IdeaTableRow[] = [
          {
            id: '1',
            text: 'Beta',
            count: 0,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          },
          {
            id: '2',
            text: 'Alpha',
            count: 5,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          },
          {
            id: '3',
            text: 'Gamma',
            count: 1,
            sampleResponse: '',
            fullSampleResponse: '',
            isSampleResponseTruncated: false,
            responses: [],
            studentGroups: []
          }
        ];

        const sortedTextAsc = component['dataSource'].sortData(testData.slice(), {
          active: 'text',
          direction: 'asc'
        } as any);

        expect(sortedTextAsc.map((r) => r.text)).toEqual(['Alpha', 'Beta', 'Gamma']);
      });
    });

    it('displays sample response without title attribute when response is not truncated', () => {
      const sampleResponseCell = fixture.nativeElement.querySelector(
        'td.mat-column-sampleResponse'
      );
      expect(sampleResponseCell).toBeTruthy();
      const span = sampleResponseCell.querySelector('span');
      expect(span).toBeTruthy();
      expect(span.textContent).toContain('It warms the car up.');
      expect(span.hasAttribute('title')).toBe(false);
      expect(sampleResponseCell.querySelector('span[title]')).toBeNull();
    });

    it('displays sample response with title attribute when response is truncated', () => {
      const longText =
        'Solar radiation easily enters through the car windshield and windows but the resulting thermal heat becomes trapped inside heating up the car extremely rapidly.';
      const longState = new ComponentState({
        workgroupId: 1,
        studentData: {
          responses: [
            { text: longText, timestamp: 12345 },
            { ideas: [{ name: 'idea 1', detected: true }] }
          ]
        }
      });
      (TestBed.inject(SummaryService).getLatestClassmateStudentWork as jasmine.Spy).and.returnValue(
        of([longState])
      );
      component.ngOnInit();
      fixture.detectChanges();

      const sampleResponseCell = fixture.nativeElement.querySelector(
        'td.mat-column-sampleResponse'
      );
      const spanWithTitle = sampleResponseCell.querySelector('span[title]');
      expect(spanWithTitle).toBeTruthy();
      expect(spanWithTitle.getAttribute('title')).toBe(longText);
      expect(spanWithTitle.textContent).toContain('car...');
      expect(spanWithTitle.textContent).not.toContain('extremel');
    });

    describe('sample response helpers', () => {
      describe('getRandomResponse', () => {
        it('returns empty string when responses are empty or undefined', () => {
          expect(component['getRandomResponse']([])).toBe('');
          expect(component['getRandomResponse'](undefined as any)).toBe('');
        });

        it('returns empty string when all candidate responses are whitespace or empty', () => {
          const responses: StudentResponseItem[] = [
            {
              text: '   ',
              texts: ['   '],
              timestamp: 1,
              usernames: 'Student 1',
              avatarColor: '#000'
            }
          ];
          expect(component['getRandomResponse'](responses)).toBe('');
        });

        it('randomly selects a candidate response from available responses', () => {
          const responses: StudentResponseItem[] = [
            {
              text: 'Response A',
              texts: ['Response A'],
              timestamp: 1,
              usernames: 'Student 1',
              avatarColor: '#000'
            },
            {
              text: 'Response B',
              texts: ['Response B'],
              timestamp: 2,
              usernames: 'Student 2',
              avatarColor: '#000'
            }
          ];
          const selected = component['getRandomResponse'](responses);
          expect(['Response A', 'Response B']).toContain(selected);
        });

        it('supports responses with texts array', () => {
          const responses: StudentResponseItem[] = [
            {
              text: '',
              texts: ['First text', 'Second text'],
              timestamp: 1,
              usernames: 'Student 1',
              avatarColor: '#000'
            }
          ];
          const selected = component['getRandomResponse'](responses);
          expect(['First text', 'Second text']).toContain(selected);
        });
      });

      describe('truncateToChars', () => {
        it('returns empty string and isTruncated false when text is empty or falsy', () => {
          expect(component['truncateToChars']('')).toEqual({ text: '', isTruncated: false });
          expect(component['truncateToChars'](undefined as any)).toEqual({
            text: '',
            isTruncated: false
          });
        });

        it('does not truncate when character count is less than or equal to maxChars', () => {
          const text = 'One two three four five';
          expect(component['truncateToChars'](text)).toEqual({
            text: 'One two three four five',
            isTruncated: false
          });
          const exact150 = 'a'.repeat(150);
          expect(component['truncateToChars'](exact150)).toEqual({
            text: exact150,
            isTruncated: false
          });
        });

        it('truncates to maxChars with ellipsis and sets isTruncated true when exceeding maxChars', () => {
          const text160 = 'a'.repeat(160);
          const expected = 'a'.repeat(150) + '...';
          expect(component['truncateToChars'](text160)).toEqual({
            text: expected,
            isTruncated: true
          });
        });

        it('trims trailing whitespace before adding ellipsis', () => {
          const text = 'a'.repeat(149) + '   ' + 'b'.repeat(10);
          const expected = 'a'.repeat(149) + '...';
          expect(component['truncateToChars'](text)).toEqual({
            text: expected,
            isTruncated: true
          });
        });

        it('does not truncate mid-word when character limit falls inside a word', () => {
          const text =
            'Solar radiation easily enters through the car windshield and windows but the resulting thermal heat becomes trapped inside heating up the car extremely rapidly.';
          const result = component['truncateToChars'](text);
          expect(result).toEqual({
            text: 'Solar radiation easily enters through the car windshield and windows but the resulting thermal heat becomes trapped inside heating up the car...',
            isTruncated: true
          });
        });

        it('supports a custom maxChars limit and avoids mid-word truncation', () => {
          const text =
            'Solar radiation easily enters through the car windshield and windows but the resulting thermal heat becomes trapped inside heating up the car rapidly.';
          const result = component['truncateToChars'](text, 120);
          expect(result).toEqual({
            text: 'Solar radiation easily enters through the car windshield and windows but the resulting thermal heat becomes trapped...',
            isTruncated: true
          });
        });

        it('preserves complete words when character limit falls at a word boundary', () => {
          const text = 'Solar radiation easily enters';
          const result = component['truncateToChars'](text, 15);
          expect(result).toEqual({
            text: 'Solar radiation...',
            isTruncated: true
          });
        });

        it('falls back to character truncation if a single word exceeds maxChars', () => {
          const longWord = 'supercalifragilisticexpialidocious';
          const result = component['truncateToChars'](longWord, 10);
          expect(result).toEqual({
            text: 'supercalif...',
            isTruncated: true
          });
        });
      });
    });

    it('returns one response per student message that contains the idea', () => {
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
      expect(dgResponses.length).toBe(2);
      expect(dgResponses.map((r) => r.texts)).toEqual([
        ['First response with idea 1'],
        ['Second response with idea 1']
      ]);
      expect(dgResponses.map((r) => r.responseTimestamp)).toEqual([100, 200]);
    });

    it('lists a message once even when several saved states contain it', () => {
      const firstSave = new ComponentState({
        id: 1,
        workgroupId: 1,
        studentData: {
          responses: [
            { text: 'First message', timestamp: 100 },
            { ideas: [{ name: 'idea 1', detected: true }] }
          ]
        }
      });
      const secondSave = new ComponentState({
        id: 2,
        workgroupId: 1,
        studentData: {
          responses: [
            { text: 'First message', timestamp: 100 },
            { ideas: [{ name: 'idea 1', detected: true }] },
            { text: 'Second message', timestamp: 200 },
            { ideas: [{ name: 'idea 1', detected: true }] }
          ]
        }
      });
      const dgResponses = component['getDGResponsesWithIdea']([firstSave, secondSave], 'idea 1');
      expect(dgResponses.length).toBe(2);
      expect(dgResponses.map((r) => r.studentWorkId)).toEqual([2, 2]);
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
        MockProviders(ConfigService, CRaterService, TeacherDataService, SummaryService),
        MockProvider(TeacherPresentationConfigService, {
          getConfig: () => of(null as any),
          saveConfig: () => of({} as any)
        }),
        MockProvider(TeacherProjectService, {
          projectSaved$: NEVER
        }),
        MockProvider(AnnotationService, {
          annotationReceived$: NEVER
        })
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

  describe('presentation selection', () => {
    let store: TeacherPresentationSelectionStore;

    beforeEach(() => {
      store = fixture.debugElement.injector.get(TeacherPresentationSelectionStore);
      const configService = TestBed.inject(ConfigService);
      spyOn(configService, 'getRunId').and.returnValue(1);
      component.periodId = 1;
      component.nodeId = 'node1';
      component.componentId = 'comp1';
      generateMockRubric(1, 1);
      generateMockStudentWorkOpenResponse(1);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('includes select column in displayedColumns when presentation is available', () => {
      expect(component['isPresentationAvailable']).toBeTrue();
      expect(component['displayedColumns']).toEqual(['select', 'text', 'sampleResponse', 'count']);
    });

    it('initializes store with Ideas type', () => {
      expect(store.type()).toBe('Ideas');
      expect(store.nodeId()).toBe('node1');
      expect(store.componentId()).toBe('comp1');
    });

    it('toggles idea category selection via store', () => {
      expect(store.isIdeaSelected('idea 1')).toBeFalse();

      store.toggleIdea('idea 1');
      expect(store.isIdeaSelected('idea 1')).toBeTrue();

      store.toggleIdea('idea 1');
      expect(store.isIdeaSelected('idea 1')).toBeFalse();
    });

    it('toggles idea category with candidate student work ids via component toggleIdea(row)', () => {
      const row = component['dataSource'].data[0];
      expect(row).toBeTruthy();
      spyOn(store, 'toggleIdea').and.callThrough();

      component['toggleIdea'](row);
      expect(store.toggleIdea).toHaveBeenCalledWith(row.id, jasmine.any(Array));
      expect(store.isIdeaSelected(row.id)).toBeTrue();
    });

    it('toggles response selection and automatically selects idea category', () => {
      const selection = { studentWorkId: 101, workgroupId: 1, responseTimestamp: null, text: 'a' };
      expect(store.isIdeaSelected('idea 1')).toBeFalse();
      expect(store.isIdeaResponseSelected('idea 1', selection)).toBeFalse();

      store.toggleIdeaResponse('idea 1', selection);
      expect(store.isIdeaSelected('idea 1')).toBeTrue();
      expect(store.isIdeaResponseSelected('idea 1', selection)).toBeTrue();
    });

    it('only includes the latest revision for a workgroup with multiple revisions', () => {
      const ideas = generateIdeas(1);
      const annotations = [
        new Annotation({
          toWorkgroupId: 1,
          studentWorkId: 101,
          periodId: 1,
          data: { ideas: ideas }
        }),
        new Annotation({
          toWorkgroupId: 1,
          studentWorkId: 102,
          periodId: 1,
          data: { ideas: ideas }
        })
      ];
      const states = [
        new ComponentState({
          id: 101,
          workgroupId: 1,
          periodId: 1,
          studentData: { response: 'First response with idea 1' }
        } as any),
        new ComponentState({
          id: 102,
          workgroupId: 1,
          periodId: 1,
          studentData: { response: 'Second response with idea 1' }
        } as any)
      ];
      (
        TestBed.inject(AnnotationService).getAnnotationsByNodeIdComponentId as jasmine.Spy
      ).and.returnValue(annotations);
      spyOn(TestBed.inject(TeacherDataService), 'getComponentStatesByComponentId').and.returnValue(
        states
      );

      component['generateIdeasSummary']();

      const row = component['dataSource'].data[0];
      expect(row.responses.length).toBe(1);
      expect(row.responses[0].studentWorkId).toBe(102);
      expect(row.responses[0].text).toBe('Second response with idea 1');
      expect(row.studentGroups.length).toBe(1);
      expect(row.studentGroups[0].responses.length).toBe(1);

      component['toggleResponse'](row, row.responses[0]);
      expect(store.isIdeaSelected(row.id)).toBeTrue();
      expect(component['isResponseSelected'](row, row.responses[0])).toBeTrue();
    });

    it('sets idea checkbox to indeterminate when idea is not selected but responses for that idea are selected', () => {
      const ideas = generateIdeas(1);
      const annotations = [
        new Annotation({
          toWorkgroupId: 1,
          studentWorkId: 101,
          periodId: 1,
          data: { ideas: ideas }
        })
      ];
      const states = [
        new ComponentState({
          id: 101,
          workgroupId: 1,
          periodId: 1,
          studentData: { response: 'Response with idea 1' }
        } as any)
      ];
      (
        TestBed.inject(AnnotationService).getAnnotationsByNodeIdComponentId as jasmine.Spy
      ).and.returnValue(annotations);
      spyOn(TestBed.inject(TeacherDataService), 'getComponentStatesByComponentId').and.returnValue(
        states
      );

      component['generateIdeasSummary']();
      fixture.detectChanges();

      const row = component['dataSource'].data[0];
      const checkboxInput: HTMLInputElement = fixture.nativeElement.querySelector(
        'td.mat-column-select input[type="checkbox"]'
      );
      const tooltip = fixture.debugElement
        .query(By.css('td.mat-column-select mat-checkbox'))
        .injector.get(MatTooltip);

      expect(component['isIdeaIndeterminate'](row)).toBeFalse();
      expect(checkboxInput.checked).toBeFalse();
      expect(checkboxInput.indeterminate).toBeFalse();
      expect(tooltip.disabled).toBeTrue();

      // Select a response (auto-selects idea category)
      component['toggleResponse'](row, row.responses[0]);
      fixture.detectChanges();
      expect(store.isIdeaSelected(row.id)).toBeTrue();
      expect(component['isIdeaIndeterminate'](row)).toBeFalse();
      expect(checkboxInput.checked).toBeTrue();
      expect(checkboxInput.indeterminate).toBeFalse();
      expect(tooltip.disabled).toBeTrue();

      // Unselect the idea category while the response remains selected
      component['toggleIdea'](row);
      fixture.detectChanges();
      expect(store.isIdeaSelected(row.id)).toBeFalse();
      expect(component['isResponseSelected'](row, row.responses[0])).toBeTrue();
      expect(component['isIdeaIndeterminate'](row)).toBeTrue();
      expect(checkboxInput.checked).toBeFalse();
      expect(checkboxInput.indeterminate).toBeTrue();
      expect(tooltip.disabled).toBeFalse();
      expect(tooltip.message).toBe('Some responses for this idea are selected');

      // Deselect the response -> idea checkbox returns to unchecked and not indeterminate
      component['toggleResponse'](row, row.responses[0]);
      fixture.detectChanges();
      expect(store.isIdeaSelected(row.id)).toBeFalse();
      expect(component['isIdeaIndeterminate'](row)).toBeFalse();
      expect(checkboxInput.checked).toBeFalse();
      expect(checkboxInput.indeterminate).toBeFalse();
      expect(tooltip.disabled).toBeTrue();
    });

    it('unchecking an idea does not select the same response in another idea row', () => {
      (TestBed.inject(CRaterService).getCRaterRubric as jasmine.Spy).and.returnValue(
        new CRaterRubric({
          ideas: [
            new CRaterIdea('idea 1', true, 'idea 1'),
            new CRaterIdea('idea 2', true, 'idea 2')
          ]
        })
      );
      const ideas = generateIdeas(2);
      const annotations = [
        new Annotation({
          toWorkgroupId: 1,
          studentWorkId: 101,
          periodId: 1,
          data: { ideas: ideas }
        })
      ];
      const states = [
        new ComponentState({
          id: 101,
          workgroupId: 1,
          periodId: 1,
          studentData: { response: 'Response with idea 1 and idea 2' }
        } as any)
      ];
      (
        TestBed.inject(AnnotationService).getAnnotationsByNodeIdComponentId as jasmine.Spy
      ).and.returnValue(annotations);
      spyOn(TestBed.inject(TeacherDataService), 'getComponentStatesByComponentId').and.returnValue(
        states
      );

      component['generateIdeasSummary']();
      fixture.detectChanges();

      const row1 = component['dataSource'].data[0];
      const row2 = component['dataSource'].data[1];

      // Select response in row 1
      component['toggleResponse'](row1, row1.responses[0]);
      fixture.detectChanges();
      expect(store.isIdeaSelected(row1.id)).toBeTrue();
      expect(component['isResponseSelected'](row1, row1.responses[0])).toBeTrue();
      expect(store.isIdeaSelected(row2.id)).toBeFalse();
      expect(component['isResponseSelected'](row2, row2.responses[0])).toBeFalse();
      expect(component['isIdeaIndeterminate'](row2)).toBeFalse();

      // Uncheck idea 1
      component['toggleIdea'](row1);
      fixture.detectChanges();
      expect(store.isIdeaSelected(row1.id)).toBeFalse();
      expect(component['isResponseSelected'](row1, row1.responses[0])).toBeTrue();
      expect(component['isIdeaIndeterminate'](row1)).toBeTrue();

      // Row 2 and its shared response should remain unselected
      expect(store.isIdeaSelected(row2.id)).toBeFalse();
      expect(component['isResponseSelected'](row2, row2.responses[0])).toBeFalse();
      expect(component['isIdeaIndeterminate'](row2)).toBeFalse();
    });

    it('excludes a workgroup when an idea was only detected in an earlier revision', () => {
      const annotations = [
        new Annotation({
          toWorkgroupId: 1,
          studentWorkId: 101,
          periodId: 1,
          data: { ideas: [{ name: 'idea 1', detected: true }] }
        }),
        new Annotation({
          toWorkgroupId: 1,
          studentWorkId: 102,
          periodId: 1,
          data: { ideas: [{ name: 'idea 1', detected: false }] }
        }),
        new Annotation({
          toWorkgroupId: 2,
          studentWorkId: 201,
          periodId: 1,
          data: { ideas: [{ name: 'idea 1', detected: true }] }
        })
      ];
      const states = [
        new ComponentState({
          id: 101,
          workgroupId: 1,
          periodId: 1,
          studentData: { response: 'First response with idea 1' }
        } as any),
        new ComponentState({
          id: 102,
          workgroupId: 1,
          periodId: 1,
          studentData: { response: 'Second response without idea 1' }
        } as any),
        new ComponentState({
          id: 201,
          workgroupId: 2,
          periodId: 1,
          studentData: { response: 'Workgroup 2 response with idea 1' }
        } as any)
      ];
      (
        TestBed.inject(AnnotationService).getAnnotationsByNodeIdComponentId as jasmine.Spy
      ).and.returnValue(annotations);
      spyOn(TestBed.inject(TeacherDataService), 'getComponentStatesByComponentId').and.returnValue(
        states
      );

      component['generateIdeasSummary']();

      const row = component['dataSource'].data[0];
      expect(row.responses.length).toBe(1);
      expect(row.responses[0].workgroupId).toBe(2);
      expect(row.responses[0].studentWorkId).toBe(201);
    });

    it('stores a snapshot of the selected response text', () => {
      const row = component['dataSource'].data[0];
      const response: StudentResponseItem = {
        studentWorkId: 5,
        workgroupId: 1,
        responseTimestamp: 1234,
        text: 'Snapshot text',
        texts: ['Snapshot text'],
        timestamp: 1234,
        usernames: 'Student 1',
        avatarColor: 'red'
      };
      component['toggleResponse'](row, response);
      expect(store.selectedIdeaResponseMap().get(row.id).get('1:1234')).toEqual({
        studentWorkId: 5,
        workgroupId: 1,
        responseTimestamp: 1234,
        text: 'Snapshot text'
      });
    });
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
    const idea = new CRaterIdea(
      'idea ' + (i + 1),
      numDetected > 0 ? true : false,
      'idea ' + (i + 1)
    );
    ideas.push(idea);
    numDetected--;
  }
  spyOn(TestBed.inject(CRaterService), 'getCRaterRubric').and.returnValue(
    new CRaterRubric({ ideas: ideas })
  );
}

function generateMockRubricForTable(): void {
  const ideas = [
    new CRaterIdea('idea 1', true, 'Solar radiation enters car'),
    new CRaterIdea('idea 2', true, 'Car is warmer than outside'),
    new CRaterIdea('idea 3', true, 'Heat is trapped in car')
  ];
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

function generateMockStudentWorkOpenResponse(numIdeasDetected: number, periodId?: number): void {
  const ideas = generateIdeas(numIdeasDetected);
  spyOn(TestBed.inject(AnnotationService), 'getAnnotationsByNodeIdComponentId').and.returnValue([
    new Annotation({
      periodId: periodId !== undefined ? periodId : (component?.periodId ?? 1),
      toWorkgroupId: 1,
      data: { ideas: ideas }
    } as any)
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
