import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TitleAndContentComponent } from '../title-and-content/title-and-content.component';

import { DialogWithConfirmComponent } from './dialog-with-confirm.component';

describe('DialogWithConfirmComponent', () => {
  let component: DialogWithConfirmComponent;
  let fixture: ComponentFixture<DialogWithConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [DialogWithConfirmComponent, TitleAndContentComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogWithConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
