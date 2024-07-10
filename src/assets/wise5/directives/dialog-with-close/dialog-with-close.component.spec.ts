import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogWithCloseComponent } from './dialog-with-close.component';

describe('DialogWithCloseComponent', () => {
  let component: DialogWithCloseComponent;
  let fixture: ComponentFixture<DialogWithCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogWithCloseComponent, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(DialogWithCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
