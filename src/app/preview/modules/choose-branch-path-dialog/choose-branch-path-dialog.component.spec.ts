import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChooseBranchPathDialogComponent } from './choose-branch-path-dialog.component';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ChooseBranchPathDialogComponent', () => {
  let component: ChooseBranchPathDialogComponent;
  let fixture: ComponentFixture<ChooseBranchPathDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [MatDialogModule, { provide: MAT_DIALOG_DATA, useValue: {} }],
        declarations: [ChooseBranchPathDialogComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseBranchPathDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
