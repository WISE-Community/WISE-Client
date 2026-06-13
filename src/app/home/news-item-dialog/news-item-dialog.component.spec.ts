import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsItemDialogComponent } from './news-item-dialog.component';

describe('NewsItemDialogComponent', () => {
  let component: NewsItemDialogComponent;
  let fixture: ComponentFixture<NewsItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsItemDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsItemDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
