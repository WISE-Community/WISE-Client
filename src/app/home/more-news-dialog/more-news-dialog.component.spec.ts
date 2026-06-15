import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreNewsDialogComponent } from './more-news-dialog.component';
import { News } from '../../domain/news';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const topics = [new News({ id: 1 }), new News({ id: 2 }), new News({ id: 3 })];
describe('MoreNewsDialogComponent', () => {
  let component: MoreNewsDialogComponent;
  let fixture: ComponentFixture<MoreNewsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreNewsDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: topics },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoreNewsDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
