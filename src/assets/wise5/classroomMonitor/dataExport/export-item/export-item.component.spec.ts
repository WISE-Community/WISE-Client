import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportItemComponent } from './export-item.component';
import { DataExportService } from '../../../services/dataExportService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClassroomMonitorTestingModule } from '../../classroom-monitor-testing.module';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

describe('ExportItemComponent', () => {
  let component: ExportItemComponent;
  let fixture: ComponentFixture<ExportItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportItemComponent],
      imports: [
        ClassroomMonitorTestingModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {}
        },
        DataExportService
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
