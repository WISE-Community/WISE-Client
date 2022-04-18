import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TitleAndContentComponent } from '../title-and-content/title-and-content.component';
import { DialogWithCloseComponent } from './dialog-with-close.component';

describe('DialogWithCloseComponent', () => {
  let component: DialogWithCloseComponent;
  let fixture: ComponentFixture<DialogWithCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [DialogWithCloseComponent, TitleAndContentComponent],
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
