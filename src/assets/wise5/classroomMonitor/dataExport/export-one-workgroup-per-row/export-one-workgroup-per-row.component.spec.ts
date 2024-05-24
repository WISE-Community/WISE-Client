import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataExportService } from '../../../services/dataExportService';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataExportModule } from '../data-export.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConfigService } from '../../../services/configService';
import { ExportOneWorkgroupPerRowComponent } from './export-one-workgroup-per-row.component';

let configService: ConfigService;
let teacherProjectService: TeacherProjectService;

describe('ExportOneWorkgroupPerRowComponent', () => {
  let component: ExportOneWorkgroupPerRowComponent;
  let fixture: ComponentFixture<ExportOneWorkgroupPerRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportOneWorkgroupPerRowComponent],
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
    fixture = TestBed.createComponent(ExportOneWorkgroupPerRowComponent);
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
