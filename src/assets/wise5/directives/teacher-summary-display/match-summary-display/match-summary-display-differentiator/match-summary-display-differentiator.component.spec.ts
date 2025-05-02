import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSummaryDisplayDifferentiatorComponent } from './match-summary-display-differentiator.component';

describe('MatchSummaryDisplayDifferentiatorComponent', () => {
  let component: MatchSummaryDisplayDifferentiatorComponent;
  let fixture: ComponentFixture<MatchSummaryDisplayDifferentiatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchSummaryDisplayDifferentiatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchSummaryDisplayDifferentiatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
