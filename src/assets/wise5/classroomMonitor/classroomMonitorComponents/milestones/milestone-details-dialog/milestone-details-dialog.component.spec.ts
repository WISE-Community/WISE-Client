import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { SelectPeriodComponent } from '../../select-period/select-period.component';
import { MilestoneDetailsComponent } from '../milestone-details/milestone-details.component';
import { MilestoneDetailsDialogComponent } from './milestone-details-dialog.component';

const milestoneName: string = 'Checkpoint #1';

describe('MilestoneDetailsDialogComponent', () => {
  let component: MilestoneDetailsDialogComponent;
  let fixture: ComponentFixture<MilestoneDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MilestoneDetailsComponent,
        MilestoneDetailsDialogComponent,
        SelectPeriodComponent
      ],
      imports: [
        ClassroomMonitorTestingModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatProgressBarModule,
        MatSelectModule
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 1, items: [], name: milestoneName, workgroups: [] }
        },
        { provide: MatDialogRef, useValue: {} },
        WorkgroupService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneDetailsDialogComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getStartNodeId').and.returnValue('node1');
    spyOn(TestBed.inject(TeacherProjectService), 'getRootNode').and.returnValue({ id: 'group0' });
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriod').and.returnValue({
      periodId: 1
    });
    spyOn(TestBed.inject(TeacherDataService), 'getPeriods').and.returnValue([{ periodId: 1 }]);
    spyOn(TestBed.inject(WorkgroupService), 'getWorkgroupsInPeriod').and.returnValue(new Map());
    fixture.detectChanges();
  });

  it('should show the milestone name', () => {
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent).toContain(milestoneName);
  });
});
