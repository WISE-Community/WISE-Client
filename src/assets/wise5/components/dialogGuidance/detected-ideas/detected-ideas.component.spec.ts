import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetectedIdeasComponent } from './detected-ideas.component';
import { By } from '@angular/platform-browser';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';

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
});
