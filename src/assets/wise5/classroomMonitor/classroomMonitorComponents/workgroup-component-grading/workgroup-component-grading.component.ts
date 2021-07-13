'use strict';

import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ViewComponentRevisionsComponent } from '../view-component-revisions/view-component-revisions.component';

@Component({
  selector: 'workgroup-component-grading',
  templateUrl: 'workgroup-component-grading.component.html'
})
export class WorkgroupComponentGradingComponent {
  @Input() componentId: string;
  @Input() nodeId: string;
  @Input() workgroupId: number;

  component: any;
  componentStates: any[];
  latestComponentState: any;
  teacherWorkgroupId: number;

  constructor(
    private dialog: MatDialog,
    private ConfigService: ConfigService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.teacherWorkgroupId = this.ConfigService.getWorkgroupId();
    this.component = this.ProjectService.getComponentByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    this.componentStates = this.TeacherDataService.getComponentStatesByWorkgroupIdAndComponentId(
      this.workgroupId,
      this.componentId
    );
    this.latestComponentState = this.TeacherDataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(
      this.workgroupId,
      this.nodeId,
      this.componentId
    );
  }

  showRevisions() {
    this.dialog.open(ViewComponentRevisionsComponent, {
      data: {
        workgroupId: this.workgroupId,
        fromWorkgroupId: this.teacherWorkgroupId,
        componentId: this.componentId,
        nodeId: this.nodeId,
        componentStates: this.componentStates
      },
      panelClass: 'mat-dialog--md'
    });
  }
}
