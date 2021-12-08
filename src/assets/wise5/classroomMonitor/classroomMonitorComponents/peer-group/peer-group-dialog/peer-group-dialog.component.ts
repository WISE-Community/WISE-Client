import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../../../services/projectService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { UtilService } from '../../../../services/utilService';

@Component({
  selector: 'peer-group-dialog',
  templateUrl: './peer-group-dialog.component.html',
  styleUrls: ['./peer-group-dialog.component.scss']
})
export class PeerGroupDialogComponent implements OnInit {
  @Input() nodeId: string;
  @Input() periodId: number;

  componentId: string;
  componentLabel: string;
  currentPeriodChangedSubscription: Subscription;
  periods: any[];
  stepNumber: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ProjectService: ProjectService,
    private TeacherDataService: TeacherDataService,
    private UtilService: UtilService
  ) {
    this.componentId = data.componentId;
    this.nodeId = data.nodeId;
    this.periodId = data.periodId;
  }

  ngOnInit() {
    this.periods = this.TeacherDataService.getVisiblePeriodsById(this.periodId);
    this.subscribeToPeriodChanged();
    this.componentLabel = this.UtilService.getComponentTypeLabel(
      this.ProjectService.getComponentType(this.nodeId, this.componentId)
    );
    this.stepNumber = this.ProjectService.getNodePositionById(this.nodeId);
  }

  subscribeToPeriodChanged(): void {
    this.currentPeriodChangedSubscription = this.TeacherDataService.currentPeriodChanged$.subscribe(
      ({ currentPeriod }) => {
        this.periodId = currentPeriod.periodId;
        this.periods = this.TeacherDataService.getVisiblePeriodsById(this.periodId);
      }
    );
  }

  ngOnDestroy() {
    this.currentPeriodChangedSubscription.unsubscribe();
  }
}
