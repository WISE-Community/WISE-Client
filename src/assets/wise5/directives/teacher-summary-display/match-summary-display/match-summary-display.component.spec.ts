import { AnnotationService } from '../../../services/annotationService';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../services/configService';
import { MatchSummaryDisplayComponent } from './match-summary-display.component';
import { MockProviders } from 'ng-mocks';
import { of } from 'rxjs';
import { SummaryService } from '../../../components/summary/summaryService';
import { CRaterService } from '../../../services/cRaterService';
import { MatchContent } from '../../../components/match/MatchContent';
import { DataService } from '../../../../../app/services/data.service';
import { ProjectService } from '../../../services/projectService';

describe('MatchSummaryDisplayComponent', () => {
  let component: MatchSummaryDisplayComponent;
  let fixture: ComponentFixture<MatchSummaryDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchSummaryDisplayComponent],
      providers: [
        MockProviders(
          AnnotationService,
          ConfigService,
          CRaterService,
          DataService,
          ProjectService,
          SummaryService
        )
      ]
    }).compileComponents();

    spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({
      id: 'cId',
      type: 'Match',
      choiceReuseEnabled: false
    } as MatchContent);
    spyOn(TestBed.inject(SummaryService), 'getLatestClassmateStudentWork').and.returnValue(
      of(getComponentStates())
    );
    spyOn(TestBed.inject(ProjectService), 'injectAssetPaths').and.callFake((componentStates) => {
      return componentStates;
    });
    fixture = TestBed.createComponent(MatchSummaryDisplayComponent);
    component = fixture.componentInstance;
    component.nodeId = 'nId';
    component.componentId = 'cId';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Choice view', () => {
    it('should display one card per unique choice', () => {
      expect(fixtureQueryAll(fixture, '.choice-card').length).toEqual(5);
    });

    it('should order choices by total count descending then alphabetically', () => {
      const cards = fixtureQueryAll(fixture, '.choice-card');
      const labels = Array.from(cards).map((el) => el.querySelector('h3')?.textContent?.trim());
      expect(labels[0]).toContain('Choice B');
      expect(labels[1]).toContain('Choice D');
      expect(labels[2]).toContain('Choice C');
      expect(labels[3]).toContain('Choice E');
      expect(labels[4]).toContain('Choice A');
    });

    it('should show bucket rows sorted by count within each choice', () => {
      const cards = fixtureQueryAll(fixture, '.choice-card');
      const choiceDCard = cards[1];
      const bucketRows = choiceDCard.querySelectorAll('.bucket-row');
      expect(bucketRows.length).toEqual(2);
      expect(bucketRows[0].textContent).toContain('Bucket 2');
      expect(bucketRows[0].textContent).toContain('2');
    });

    it('should show the correct count for Choice B in Bucket 1', () => {
      const cards = fixtureQueryAll(fixture, '.choice-card');
      const choiceBCard = cards[0];
      expect(choiceBCard.textContent).toContain('3');
    });

    it('should show "Not moved by any students" for choices left in the source bucket', () => {
      const cards = fixtureQueryAll(fixture, '.choice-card');
      const choiceACard = cards[4];
      expect(choiceACard.textContent).toContain('Not moved by any students');
      expect(choiceACard.querySelectorAll('.bucket-row').length).toEqual(1);
    });
  });

  describe('Bucket view', () => {
    beforeEach(() => {
      component.viewMode = 'bucket';
      fixture.detectChanges();
    });

    it('should display one card per unique non-source bucket', () => {
      expect(fixtureQueryAll(fixture, '.bucket-card').length).toBe(2);
    });

    it('should show choices sorted by count within each bucket', () => {
      const cards = fixtureQueryAll(fixture, '.bucket-card');
      const bucket1Card = cards[0];
      const choiceRows = bucket1Card.querySelectorAll('.choice-row');
      expect(choiceRows.length).toBe(3);
      expect(choiceRows[0].textContent).toContain('Choice B');
      expect(choiceRows[0].textContent).toContain('3');
      expect(choiceRows[1].textContent).toContain('Choice C');
      expect(choiceRows[1].textContent).toContain('2');
      expect(choiceRows[2].textContent).toContain('Choice D');
      expect(choiceRows[2].textContent).toContain('1');
    });
  });
});

function fixtureQueryAll(
  fixture: ComponentFixture<MatchSummaryDisplayComponent>,
  selector: string
): Element[] {
  return fixture.nativeElement.querySelectorAll(selector);
}

function getComponentStates(): any {
  return [
    {
      id: 1,
      componentId: 'cId',
      nodeId: 'nId',
      periodId: 1,
      runId: 1,
      studentData: {
        buckets: [
          {
            id: '0',
            type: 'bucket',
            value: 'Choices',
            items: [
              {
                isIncorrectPosition: null,
                id: 'a',
                value: 'Choice A'
              }
            ]
          },
          {
            id: 'b1',
            value: 'Bucket 1',
            items: [
              {
                isIncorrectPosition: null,
                id: 'b',
                value: 'Choice B'
              },
              {
                isIncorrectPosition: null,
                id: 'c',
                value: 'Choice C'
              }
            ]
          },
          {
            id: 'b2',
            value: 'Bucket 2',
            items: [
              {
                isIncorrectPosition: null,
                id: 'd',
                value: 'Choice D'
              },
              {
                isIncorrectPosition: null,
                id: 'e',
                value: 'Choice E'
              }
            ]
          }
        ]
      },
      workgroupId: 1
    },
    {
      id: 2,
      componentId: 'cId',
      nodeId: 'nId',
      periodId: 1,
      runId: 1,
      studentData: {
        buckets: [
          {
            id: '0',
            type: 'bucket',
            value: 'Choices',
            items: [
              {
                isIncorrectPosition: null,
                id: 'a',
                value: 'Choice A'
              }
            ]
          },
          {
            id: 'b1',
            value: 'Bucket 1',
            items: [
              {
                isIncorrectPosition: null,
                id: 'b',
                value: 'Choice B'
              },
              {
                isIncorrectPosition: null,
                id: 'c',
                value: 'Choice C'
              },
              {
                isIncorrectPosition: null,
                id: 'd',
                value: 'Choice D'
              }
            ]
          },
          {
            id: 'b2',
            value: 'Bucket 2',
            items: [
              {
                isIncorrectPosition: null,
                id: 'e',
                value: 'Choice E'
              }
            ]
          }
        ]
      },
      workgroupId: 2
    },
    {
      id: 3,
      componentId: 'cId',
      nodeId: 'nId',
      periodId: 1,
      runId: 1,
      studentData: {
        buckets: [
          {
            id: '0',
            type: 'bucket',
            value: 'Choices',
            items: []
          },
          {
            id: 'b1',
            value: 'Bucket 1',
            items: [
              {
                isIncorrectPosition: null,
                id: 'b',
                value: 'Choice B'
              }
            ]
          },
          {
            id: 'b2',
            value: 'Bucket 2',
            items: [
              {
                isIncorrectPosition: null,
                id: 'b',
                value: 'Choice D'
              }
            ]
          }
        ]
      },
      workgroupId: 3
    }
  ];
}
