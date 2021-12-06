import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { UpgradeModule } from '@angular/upgrade/static';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { AchievementService } from '../../../../services/achievementService';
import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { NotificationService } from '../../../../services/notificationService';
import { ProjectService } from '../../../../services/projectService';
import { SessionService } from '../../../../services/sessionService';
import { StudentDataService } from '../../../../services/studentDataService';
import { StudentStatusService } from '../../../../services/studentStatusService';
import { TagService } from '../../../../services/tagService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService'; 
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import { UtilService } from '../../../../services/utilService';
import { SelectPeriodComponent } from '../../select-period/select-period.component';

import { PeerGroupDialogComponent } from './peer-group-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

describe('PeerGroupDialogComponent', () => {
  let component: PeerGroupDialogComponent;
  let fixture: ComponentFixture<PeerGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeerGroupDialogComponent, SelectPeriodComponent],
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatSelectModule
      ],
      providers: [
        AchievementService,
        AnnotationService,
        ConfigService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        NotificationService,
        ProjectService,
        SessionService,
        StudentDataService,
        StudentStatusService,
        TagService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        UpgradeModule,
        UtilService,
        WorkgroupService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupDialogComponent);
    spyOn(TestBed.inject(TeacherProjectService), 'getStartNodeId').and.returnValue('node1');
    spyOn(TestBed.inject(TeacherProjectService), 'getRootNode').and.returnValue({ id: 'group0' });
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriod').and.returnValue({
      periodId: 1,
      periodName: '1'
    });
    spyOn(TestBed.inject(TeacherDataService), 'getPeriods').and.returnValue([{ periodId: 1, periodName: '1' }, 
        {id: 2, periodName: '2'}]);
    spyOn(TestBed.inject(ProjectService), 'getComponentType').and.returnValue('PeerChat');
    spyOn(TestBed.inject(UtilService), 'getComponentTypeLabel').and.returnValue('Peer Chat');
    spyOn(TestBed.inject(WorkgroupService), 'getWorkgroupsInPeriod').and.returnValue(new Map());
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
