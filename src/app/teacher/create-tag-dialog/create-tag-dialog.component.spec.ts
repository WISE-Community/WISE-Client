import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTagDialogComponent } from './create-tag-dialog.component';
import { TagService } from '../../../assets/wise5/services/tagService';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('CreateTagDialogComponent', () => {
  let component: CreateTagDialogComponent;
  let fixture: ComponentFixture<CreateTagDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CreateTagDialogComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [{ provide: MatDialogRef, useValue: { close() {} } }, TagService]
    });
    fixture = TestBed.createComponent(CreateTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
