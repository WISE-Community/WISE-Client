import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchSummaryDisplayDifferentiatorComponent } from './match-summary-display-differentiator.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { MockComponents, MockProvider } from 'ng-mocks';
import { OrderedMatchSummaryDisplayComponent } from '../ordered-match-summary-display/ordered-match-summary-display.component';
import { UnorderedMatchSummaryDisplayComponent } from '../unordered-match-summary-display/unordered-match-summary-display.component';

describe('MatchSummaryDisplayDifferentiatorComponent', () => {
  let component: MatchSummaryDisplayDifferentiatorComponent;
  let fixture: ComponentFixture<MatchSummaryDisplayDifferentiatorComponent>;
  let getComponentSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponents(OrderedMatchSummaryDisplayComponent, UnorderedMatchSummaryDisplayComponent)
      ],
      imports: [MatchSummaryDisplayDifferentiatorComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();
    getComponentSpy = spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentsFromStep' as any
    ).and.callFake(() => getUnorderedContent());

    fixture = TestBed.createComponent(MatchSummaryDisplayDifferentiatorComponent);
    component = fixture.componentInstance;
    component.componentId = 'cId';
    component.nodeId = 'nId';
    fixture.detectChanges();
  });

  it('should create an ordered match summary display', () => {
    getComponentSpy.and.callFake(() => getOrderedContent());
    component.ngOnInit();
    fixture.detectChanges();
    expectSummaryLength(fixture, 'ordered', 1);
    expectSummaryLength(fixture, 'unordered', 0);
  });

  it('should create an unordered match summary display', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expectSummaryLength(fixture, 'ordered', 0);
    expectSummaryLength(fixture, 'unordered', 1);
  });
});

function expectSummaryLength(
  fixture: ComponentFixture<MatchSummaryDisplayDifferentiatorComponent>,
  type: string,
  toEqual: number
): void {
  expect(fixture.nativeElement.querySelectorAll(`${type}-match-summary-display`).length).toEqual(
    toEqual
  );
}

function getOrderedContent(): any {
  return [
    {
      id: 'cId',
      feedback: [
        { choices: [{ position: 1 }, { position: 2 }] },
        { choices: [{ position: null }, { position: null }] }
      ]
    }
  ];
}

function getUnorderedContent(): any {
  return [
    {
      id: 'cId',
      feedback: [
        { choices: [{ position: null }, { position: null }] },
        { choices: [{ position: null }, { position: null }] }
      ]
    }
  ];
}
