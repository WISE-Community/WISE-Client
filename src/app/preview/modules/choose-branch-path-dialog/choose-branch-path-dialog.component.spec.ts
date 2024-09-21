import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChooseBranchPathDialogComponent } from './choose-branch-path-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ChooseBranchPathDialogComponent', () => {
  let component: ChooseBranchPathDialogComponent;
  let fixture: ComponentFixture<ChooseBranchPathDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MAT_DIALOG_DATA, useValue: [] }],
      imports: [ChooseBranchPathDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseBranchPathDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
