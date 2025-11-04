import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarTriggerComponent } from './snackbar-trigger.component';

describe('SnackbarTriggerComponent', () => {
  let component: SnackbarTriggerComponent;
  let fixture: ComponentFixture<SnackbarTriggerComponent>;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarTriggerComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarTriggerComponent);
    component = fixture.componentInstance;
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open a snackbar', () => {
    spyOn(snackBar, 'open');
    component.openSnackBar();
    expect(snackBar.open).toHaveBeenCalled();
  });
});
