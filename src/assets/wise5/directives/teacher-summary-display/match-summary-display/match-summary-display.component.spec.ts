import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSummaryDisplayComponent } from './match-summary-display.component';

describe('MatchSummaryDisplayComponent', () => {
  let component: MatchSummaryDisplayComponent;
  let fixture: ComponentFixture<MatchSummaryDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchSummaryDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchSummaryDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
