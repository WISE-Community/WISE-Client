import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../services/configService';
import { DataExportService } from '../../../services/dataExportService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';

import { ExportVisitsComponent } from './export-visits.component';

describe('ExportVisitsComponent', () => {
  let component: ExportVisitsComponent;
  let fixture: ComponentFixture<ExportVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportVisitsComponent],
      imports: [ClassroomMonitorTestingModule],
      providers: [DataExportService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportVisitsComponent);
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
