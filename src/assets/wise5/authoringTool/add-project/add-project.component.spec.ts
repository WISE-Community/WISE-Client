import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { MatIconModule } from '@angular/material/icon';
import { AddProjectComponent } from './add-project.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

describe('AddProjectComponent', () => {
  let component: AddProjectComponent;
  let fixture: ComponentFixture<AddProjectComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProjectComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(AddProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // TODO: this test doesn't pass atm because AddProjectComponent.ngAfterViewInit() causes
  // the error which you can read about here: https://angular.io/errors/NG0100
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
