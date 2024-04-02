import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageTagsDialogComponent } from './manage-tags-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectTagService } from '../../../assets/wise5/services/projectTagService';

describe('ManageTagsDialogComponent', () => {
  let component: ManageTagsDialogComponent;
  let fixture: ComponentFixture<ManageTagsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ManageTagsDialogComponent,
        MatSnackBarModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [ProjectTagService]
    });
    fixture = TestBed.createComponent(ManageTagsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
