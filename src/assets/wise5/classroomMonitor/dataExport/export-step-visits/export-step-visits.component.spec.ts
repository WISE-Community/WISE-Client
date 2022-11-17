import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { ExportStepVisitsComponent } from './export-step-visits.component';

describe('ExportStepVisitsComponent', () => {
  let component: ExportStepVisitsComponent;
  let fixture: ComponentFixture<ExportStepVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportStepVisitsComponent],
      imports: [ClassroomMonitorTestingModule],
      providers: [DataExportService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportStepVisitsComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(ConfigService), 'getPermissions').and.returnValue({
      canAuthorProject: true,
      canGradeStudentWork: true,
      canViewStudentNames: true
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeOrderOfProject').and.returnValue({
      nodes: []
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
