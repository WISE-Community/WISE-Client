import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetectedIdeasComponent } from './detected-ideas.component';
import { CRaterService } from '../../../services/cRaterService';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { By } from '@angular/platform-browser';

describe('DetectedIdeasComponent', () => {
  let component: DetectedIdeasComponent;
  let fixture: ComponentFixture<DetectedIdeasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetectedIdeasComponent],
      providers: [{ provide: CRaterService, useValue: { getCRaterRubric() {} } }]
    }).compileComponents();

    fixture = TestBed.createComponent(DetectedIdeasComponent);
    component = fixture.componentInstance;
    component.componentState = {
      studentData: { responses: [] }
    };
    spyOn(TestBed.inject(CRaterService), 'getCRaterRubric').and.returnValue({} as CRaterRubric);
    fixture.detectChanges();
  });

  it('should create and display no ideas', () => {
    expect(component).toBeTruthy();
    expect(fixture.debugElement.queryAll(By.css('li')).length).toEqual(0);
  });
});
