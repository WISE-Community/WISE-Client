import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../services/configService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { StudentGradingToolsComponent } from './student-grading-tools.component';
import { provideRouter } from '@angular/router';
import { MatButtonHarness } from '@angular/material/button/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('StudentGradingToolsComponent', () => {
  let component: StudentGradingToolsComponent;
  let fixture: ComponentFixture<StudentGradingToolsComponent>;
  let dataService: TeacherDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, StudentGradingToolsComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGradingToolsComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(TeacherDataService);
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

  it('should disable prevButton when there are no previous teams', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const prevButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '[mattooltip="Previous Team"]' })
    );
    expect(await prevButton.isDisabled()).toBeTruthy();
  });
});
