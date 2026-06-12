import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreNewsDialogComponent } from './more-news-dialog.component';

describe('MoreNewsDialogComponent', () => {
  let component: MoreNewsDialogComponent;
  let fixture: ComponentFixture<MoreNewsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreNewsDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MoreNewsDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
