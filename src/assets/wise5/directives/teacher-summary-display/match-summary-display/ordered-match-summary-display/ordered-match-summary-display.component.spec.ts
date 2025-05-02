import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedMatchSummaryDisplayComponent } from './ordered-match-summary-display.component';

describe('OrderedMatchSummaryDisplayComponent', () => {
  let component: OrderedMatchSummaryDisplayComponent;
  let fixture: ComponentFixture<OrderedMatchSummaryDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderedMatchSummaryDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderedMatchSummaryDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
