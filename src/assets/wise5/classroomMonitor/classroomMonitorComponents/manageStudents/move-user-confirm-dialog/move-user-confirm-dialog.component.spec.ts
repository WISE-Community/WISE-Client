import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveUserConfirmDialogComponent } from './move-user-confirm-dialog.component';

describe('MoveUserConfirmDialogComponent', () => {
  let component: MoveUserConfirmDialogComponent;
  let fixture: ComponentFixture<MoveUserConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveUserConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveUserConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
