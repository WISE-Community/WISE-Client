import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportEventsComponent } from './export-events.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { DataExportService } from '../../../services/dataExportService';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

let configService: ConfigService;
let teacherProjectService: TeacherProjectService;
const group0 = {
  id: 'group0',
  type: 'group',
  title: 'Master',
  startId: '',
  ids: []
};
describe('ExportEventsComponent', () => {
  let component: ExportEventsComponent;
  let fixture: ComponentFixture<ExportEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, ExportEventsComponent],
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
    fixture = TestBed.createComponent(ExportEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
