import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChooseBranchPathDialogComponent } from './choose-branch-path-dialog.component';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ChooseBranchPathDialogComponent', () => {
  let component: ChooseBranchPathDialogComponent;
  let fixture: ComponentFixture<ChooseBranchPathDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [MatDialogModule, { provide: MAT_DIALOG_DATA, useValue: {} }],
      declarations: [ChooseBranchPathDialogComponent]
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
