import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportGradebookComponent } from './export-gradebook.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataExportService } from '../../../services/dataExportService';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataExportModule } from '../data-export.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConfigService } from '../../../services/configService';

let configService: ConfigService;
let teacherProjectService: TeacherProjectService;

describe('ExportGradebookComponent', () => {
  let component: ExportGradebookComponent;
  let fixture: ComponentFixture<ExportGradebookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportGradebookComponent],
      imports: [
        ClassroomMonitorTestingModule,
        DataExportModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatIconModule,
        RouterTestingModule
      ],
      providers: [DataExportService]
    });
    fixture = TestBed.createComponent(ExportGradebookComponent);
    component = fixture.componentInstance;
    configService = TestBed.inject(ConfigService);
    spyOn(configService, 'getPermissions').and.returnValue({
      canAuthorProject: true,
      canGradeStudentWork: true,
      canViewStudentNames: true
    });
    teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'getNodeOrderOfProject').and.returnValue({
      idToOrder: {},
      nodes: []
    });
    teacherProjectService.project = {
      nodes: [],
      inactiveNodes: [],
      metadata: {
        title: 'Test Project'
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
