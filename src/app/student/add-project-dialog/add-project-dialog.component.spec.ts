import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProjectDialogComponent } from './add-project-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentService } from '../student.service';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

export class MockStudentService {}

describe('AddProjectDialogComponent', () => {
  let component: AddProjectDialogComponent;
  let fixture: ComponentFixture<AddProjectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProjectDialogComponent],
      imports: [BrowserAnimationsModule, MatSelectModule, MatInputModule],
      providers: [
        { provide: StudentService, useClass: MockStudentService },
        {
          provide: MatDialog,
          useValue: {
            closeAll: () => {}
          }
        },
        { provide: ActivatedRoute, useValue: { queryParams: Observable.create() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AddProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should detect valid project codes', () => {
    ['Cat123', 'Cat1234'].forEach((projectCode) => {
      expect(component.isValidRunCodeSyntax(projectCode)).toEqual(true);
    });
  });

  it('should detect invalid project codes', () => {
    ['Cat12', 'Cat12345'].forEach((projectCode) => {
      expect(component.isValidRunCodeSyntax(projectCode)).toEqual(false);
    });
  });

  it('should detect invalid run code response', () => {
    const runInfo = {
      error: 'runNotFound'
    };
    component.handleRunCodeResponse(runInfo);
    expect(component.addProjectForm.controls['runCode'].getError('invalidRunCode')).toEqual(true);
  });

  it('should detect WISE4 run code response as invalid', () => {
    const runInfo = {
      wiseVersion: 4
    };
    component.handleRunCodeResponse(runInfo);
    expect(component.addProjectForm.controls['runCode'].getError('invalidRunCode')).toEqual(true);
  });

  it('should detect valid run code response', () => {
    const runInfo = {
      wiseVersion: 5
    };
    expect(component.addProjectForm.controls['period'].enabled).toEqual(false);
    component.handleRunCodeResponse(runInfo);
    expect(component.addProjectForm.controls['runCode'].hasError('invalideRunCode')).toEqual(false);
    expect(component.addProjectForm.controls['period'].enabled).toEqual(true);
  });
});
