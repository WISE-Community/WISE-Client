import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsItemDialogComponent } from './news-item-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { News } from '../../domain/news';

const newsItem = {
  newsItem: new News({ id: 1 })
};
describe('NewsItemDialogComponent', () => {
  let component: NewsItemDialogComponent;
  let fixture: ComponentFixture<NewsItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsItemDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: newsItem },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsItemDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
