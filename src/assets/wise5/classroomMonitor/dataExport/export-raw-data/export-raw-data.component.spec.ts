import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportRawDataComponent } from './export-raw-data.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { DataExportService } from '../../../services/dataExportService';
import { ActivatedRoute } from '@angular/router';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConfigService } from '../../../services/configService';

let configService: ConfigService;
let teacherProjectService: TeacherProjectService;
const group0 = {
  id: 'group0',
  type: 'group',
  title: 'Master',
  startId: '',
  ids: []
};
describe('ExportRawDataComponent', () => {
  let component: ExportRawDataComponent;
  let fixture: ComponentFixture<ExportRawDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, ExportRawDataComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        },
        DataExportService
      ]
    });
    teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'getNodeOrderOfProject').and.returnValue({
      idToOrder: {},
      nodes: [group0]
    });
    teacherProjectService.project = {
      metadata: {
        title: 'Test Project'
      },
      startGroupId: 'group0',
      startNodeId: 'group0',
      nodes: [group0]
    };
    teacherProjectService.idToNode['group0'] = group0;
    configService = TestBed.inject(ConfigService);
    spyOn(configService, 'getPermissions').and.returnValue({
      canGradeStudentWork: true,
      canViewStudentNames: true,
      canAuthorProject: true
    });
    fixture = TestBed.createComponent(ExportRawDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
