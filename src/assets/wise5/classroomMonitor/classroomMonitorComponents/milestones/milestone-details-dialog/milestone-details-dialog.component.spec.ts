import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { WorkgroupService } from '../../../../../../app/services/workgroup.service';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';
import { MilestoneDetailsDialogComponent } from './milestone-details-dialog.component';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

const milestoneName: string = 'Checkpoint #1';
describe('MilestoneDetailsDialogComponent', () => {
  let component: MilestoneDetailsDialogComponent;
  let fixture: ComponentFixture<MilestoneDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomMonitorTestingModule, MilestoneDetailsDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 1, items: [], name: milestoneName, workgroups: [] }
        },
        { provide: MatDialogRef, useValue: {} },
        WorkgroupService,
        provideHttpClient()
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
    const title = fixture.debugElement.query(By.css('[mat-dialog-title]'));
    expect(title.nativeElement.textContent).toContain(milestoneName);
  });
});
