import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../../../services/teacherWebSocketService';
import { SelectPeriodComponent } from '../../select-period/select-period.component';
import { PeerGroupDialogComponent } from './peer-group-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ClassroomStatusService } from '../../../../services/classroomStatusService';
import { PeerGrouping } from '../../../../../../app/domain/peerGrouping';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
        MatSelectModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        WorkgroupService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupDialogComponent);
    spyOn(TestBed.inject(TeacherProjectService), 'getStartNodeId').and.returnValue('node1');
    spyOn(TestBed.inject(TeacherProjectService), 'getRootNode').and.returnValue({ id: 'group0' });
    spyOn(TestBed.inject(TeacherProjectService), 'getPeerGrouping').and.returnValue(
      new PeerGrouping()
    );
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriodId').and.returnValue(1);
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriod').and.returnValue({
      periodId: 1,
      periodName: '1'
    });
    spyOn(TestBed.inject(TeacherDataService), 'getPeriods').and.returnValue([
      { periodId: 1, periodName: '1' },
      { id: 2, periodName: '2' }
    ]);
    spyOn(TestBed.inject(WorkgroupService), 'getWorkgroupsInPeriod').and.returnValue(new Map());
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
