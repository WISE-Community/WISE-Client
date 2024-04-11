import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTagDialogComponent } from './edit-tag-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditTagDialogComponent', () => {
  let component: EditTagDialogComponent;
  let fixture: ComponentFixture<EditTagDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        EditTagDialogComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close() {} } },
        ProjectTagService
      ]
    });
    fixture = TestBed.createComponent(EditTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
