import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnorderedMatchSummaryDisplayComponent } from './unordered-match-summary-display.component';
import { SummaryService } from '../../../../components/summary/summaryService';
import { of } from 'rxjs';
import { MockProviders } from 'ng-mocks';
import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

fdescribe('UnorderedMatchSummaryDisplayComponent', () => {
  let component: UnorderedMatchSummaryDisplayComponent;
  let fixture: ComponentFixture<UnorderedMatchSummaryDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnorderedMatchSummaryDisplayComponent],
      providers: [
        MockProviders(
          AnnotationService,
          ConfigService,
          TeacherDataService,
          TeacherProjectService,
          SummaryService
        )
      ]
    }).compileComponents();
    spyOn(TestBed.inject(SummaryService), 'getLatestClassmateStudentWork').and.returnValue(
      of(getComponentStates())
    );

    fixture = TestBed.createComponent(UnorderedMatchSummaryDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct number of buckets and choices', () => {
    expect(fixtureQueryAll(fixture, '.bucket').length).toEqual(2);
    expect(fixtureQueryAll(fixture, '.match-item').length).toEqual(5);
    fixture.nativeElement.querySelector('a').click();
    fixture.detectChanges();
    expect(fixtureQueryAll(fixture, '.match-item').length).toEqual(6);
  });

  it('should only show Show More button if more than 3 choices in bucket', () => {
    expect(fixtureQueryAll(fixture, '.bucket > a').length).toEqual(1);
  });

  it('should display choices within bucket sorted by count', () => {
    const choices = fixtureQueryAll(fixture, '.match-item');
    expect(choices[0].textContent.includes('Choice B'));
    expect(choices[1].textContent.includes('Choice A'));
    expect(choices[2].textContent.includes('Choice C'));
    expect(choices[3].textContent.includes('Choice D'));
  });

  it('should show the correct count on each choice per bucket', () => {
    const choices = fixtureQueryAll(fixture, '.match-item');
    expect(choices[0].textContent.includes('3'));
    expect(choices[1].textContent.includes('2'));
    expect(choices[2].textContent.includes('2'));
    expect(choices[3].textContent.includes('1'));
  });

  it('should change Show More to Hide when clicked', () => {
    let button = fixture.nativeElement.querySelector('a');
    expect(button.innerText).toEqual('Show More');
    button.click();
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('a');
    expect(button.innerText).toEqual('Hide');
    button.click();
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('a');
    expect(button.innerText).toEqual('Show More');
  });
});

function fixtureQueryAll(
  fixture: ComponentFixture<UnorderedMatchSummaryDisplayComponent>,
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
            items: []
          },
          {
            id: 'b1',
            value: 'Bucket 1',
            items: [
              {
                isIncorrectPosition: null,
                id: 'a',
                value: 'Choice A'
              },
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
            items: []
          },
          {
            id: 'b1',
            value: 'Bucket 1',
            items: [
              {
                isIncorrectPosition: null,
                id: 'a',
                value: 'Choice A'
              },
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
            items: []
          }
        ]
      },
      workgroupId: 3
    }
  ];
}
