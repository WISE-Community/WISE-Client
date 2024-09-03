import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportRawDataComponent } from './export-raw-data.component';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { DataExportService } from '../../../services/dataExportService';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectStepAndComponentCheckboxesComponent } from '../select-step-and-component-checkboxes/select-step-and-component-checkboxes.component';
import { MatRadioModule } from '@angular/material/radio';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { FormsModule } from '@angular/forms';
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
      declarations: [ExportRawDataComponent, SelectStepAndComponentCheckboxesComponent],
      imports: [
        ClassroomMonitorTestingModule,
        FormsModule,
        MatCheckboxModule,
        MatIconModule,
        MatRadioModule
      ],
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
