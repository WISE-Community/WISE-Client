import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentAverageScoreComponent } from './component-average-score.component';
import { AnnotationService } from '../../../services/annotationService';
import { MockProvider } from 'ng-mocks';
import { Node } from '../../../common/Node';
import { Annotation } from '../../../common/Annotation';

let component: ComponentAverageScoreComponent;
let fixture: ComponentFixture<ComponentAverageScoreComponent>;
describe('ComponentAverageScoreComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentAverageScoreComponent],
      providers: [MockProvider(AnnotationService)]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentAverageScoreComponent);
    component = fixture.componentInstance;
    component.component = { id: 'component1', maxScore: 10 };
    component.node = { id: 'node1' } as Node;
    component.periodId = 1;
  });

  ngOnChanges();
});

function ngOnChanges() {
  describe('ngOnChanges()', () => {
    ngChanges_NoScoresAvailable_ShowNA();
    ngChanges_ScoresAvailable_ShowAverage();
  });
}

function ngChanges_NoScoresAvailable_ShowNA() {
  describe('no scores available', () => {
    beforeEach(() =>
      spyOn(TestBed.inject(AnnotationService), 'getAnnotationsByNodeIdComponentId').and.returnValue(
        [] as Annotation[]
      )
    );
    it('should show "N/A"', () => {
      component.ngOnChanges();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toEqual('N/A');
    });
  });
}

function ngChanges_ScoresAvailable_ShowAverage() {
  describe('scores available', () => {
    beforeEach(() => {
      spyOn(TestBed.inject(AnnotationService), 'getAnnotationsByNodeIdComponentId').and.returnValue(
        [
          {
            nodeId: 'node1',
            componentId: 'component1',
            type: 'score',
            toWorkgroupId: 1,
            periodId: 1,
            data: { value: 3 }
          },
          {
            nodeId: 'node1',
            componentId: 'component1',
            type: 'autoScore',
            toWorkgroupId: 2,
            periodId: 1,
            data: { value: 5 }
          }
        ] as Annotation[]
      );
      component.ngOnChanges();
      fixture.detectChanges();
    });
    it('should show average score', () => {
      expect(fixture.nativeElement.textContent.trim()).toEqual('4');
    });
  });
}
