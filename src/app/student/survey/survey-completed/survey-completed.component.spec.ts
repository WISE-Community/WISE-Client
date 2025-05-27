import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyCompletedComponent } from './survey-completed.component';

describe('SurveyCompletedComponent', () => {
  let component: SurveyCompletedComponent;
  let fixture: ComponentFixture<SurveyCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyCompletedComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
