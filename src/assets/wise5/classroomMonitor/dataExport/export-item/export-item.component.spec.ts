import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportItemComponent } from './export-item.component';
import { DataExportService } from '../../../services/dataExportService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ExportItemComponent', () => {
  let component: ExportItemComponent;
  let fixture: ComponentFixture<ExportItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, ExportItemComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        },
        DataExportService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    spyOn(TestBed.inject(ConfigService), 'getPermissions').and.returnValue({
      canViewStudentNames: true,
      canGradeStudentWork: true,
      canAuthorProject: true
    });
    const teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'getNodeOrderOfProject').and.returnValue({
      idToOrder: {},
      nodes: []
    });
    teacherProjectService.project = {
      metadata: {
        title: 'Test Project'
      }
    };
    fixture = TestBed.createComponent(ExportItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
