import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetectedIdeasComponent } from './detected-ideas.component';
import { By } from '@angular/platform-browser';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { CRaterIdea } from '../../common/cRater/CRaterIdea';

describe('DetectedIdeasComponent', () => {
  let component: DetectedIdeasComponent;
  let fixture: ComponentFixture<DetectedIdeasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetectedIdeasComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DetectedIdeasComponent);
    component = fixture.componentInstance;
    component.responses = [];
    component.cRaterRubric = new CRaterRubric({ ideas: [] });
    fixture.detectChanges();
  });

  it('should create and display no ideas', () => {
    expect(component).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.css('li')).length).toEqual(0);
  });

  it('should display idea text', () => {
    component.cRaterRubric = new CRaterRubric({
      ideas: [new CRaterIdea('1', undefined, 'First idea'), new CRaterIdea('2', undefined, 'Second idea')]
    });
    component.responses = [
      {
        ideas: [
          { name: '1', detected: true },
          { name: '2', detected: true }
        ]
      }
    ];
    component.ngOnInit();
    fixture.detectChanges();
    const ideaElements = fixture.nativeElement.querySelectorAll('.idea');
    expect(ideaElements.length).toEqual(2);
    expect(ideaElements[0].textContent.trim()).toEqual('First idea');
    expect(ideaElements[1].textContent.trim()).toEqual('Second idea');
  });
});
