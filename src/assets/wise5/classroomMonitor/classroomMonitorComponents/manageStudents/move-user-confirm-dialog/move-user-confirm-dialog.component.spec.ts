import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MoveUserConfirmDialogComponent } from './move-user-confirm-dialog.component';

describe('MoveUserConfirmDialogComponent', () => {
  let component: MoveUserConfirmDialogComponent;
  let fixture: ComponentFixture<MoveUserConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveUserConfirmDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: true }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveUserConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and show warning text', () => {
    expect(component).toBeTruthy();
    expect(getWarningIcon()).toBeTruthy();
  });

  it('warning text should not be shown if not moving from a workgroup', () => {
    component.isMovingFromWorkgroup = false;
    fixture.detectChanges();
    expect(getWarningIcon()).toBeFalsy();
  });

  function getWarningIcon() {
    return fixture.debugElement.nativeElement.querySelector('mat-icon[color="warn"]');
  }
});
