import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnorderedMatchSummaryDisplayComponent } from './unordered-match-summary-display.component';

describe('UnorderedMatchSummaryDisplayComponent', () => {
  let component: UnorderedMatchSummaryDisplayComponent;
  let fixture: ComponentFixture<UnorderedMatchSummaryDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnorderedMatchSummaryDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnorderedMatchSummaryDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
