import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { StudentGradingToolsComponent } from './student-grading-tools.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('StudentGradingToolsComponent', () => {
  let component: StudentGradingToolsComponent;
  let fixture: ComponentFixture<StudentGradingToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentGradingToolsComponent],
      imports: [
        ClassroomMonitorTestingModule,
        FormsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        RouterTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGradingToolsComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ConfigService), 'getPermissions').and.returnValue({
      canAuthorProject: true,
      canGradeStudentWork: true,
      canViewStudentNames: true
    });
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriod').and.returnValue({
      periodId: 1
    });
    spyOn(TestBed.inject(ConfigService), 'getClassmateUserInfos').and.returnValue([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
