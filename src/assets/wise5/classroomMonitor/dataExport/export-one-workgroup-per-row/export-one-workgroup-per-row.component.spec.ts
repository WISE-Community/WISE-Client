import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataExportService } from '../../../services/dataExportService';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConfigService } from '../../../services/configService';
import { ExportOneWorkgroupPerRowComponent } from './export-one-workgroup-per-row.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

let configService: ConfigService;
let teacherProjectService: TeacherProjectService;
const group0 = {
  id: 'group0',
  type: 'group',
  title: 'Master',
  startId: '',
  ids: []
};
describe('ExportOneWorkgroupPerRowComponent', () => {
  let component: ExportOneWorkgroupPerRowComponent;
  let fixture: ComponentFixture<ExportOneWorkgroupPerRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, ExportOneWorkgroupPerRowComponent],
      providers: [DataExportService, provideHttpClient(), provideRouter([])]
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
      nodes: [group0]
    });
    teacherProjectService.project = {
      inactiveNodes: [],
      metadata: {
        title: 'Test Project'
      },
      startGroupId: 'group0',
      startNodeId: 'group0',
      nodes: [group0]
    };
    teacherProjectService.idToNode['group0'] = group0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
