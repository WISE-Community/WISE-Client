import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTagDialogComponent } from './create-tag-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';

describe('CreateTagDialogComponent', () => {
  let component: CreateTagDialogComponent;
  let fixture: ComponentFixture<CreateTagDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CreateTagDialogComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatSnackBarModule
      ],
      providers: [{ provide: MatDialogRef, useValue: { close() {} } }, ProjectTagService]
    });
    fixture = TestBed.createComponent(CreateTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
