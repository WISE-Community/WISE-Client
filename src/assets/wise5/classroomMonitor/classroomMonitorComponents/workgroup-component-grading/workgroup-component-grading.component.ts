'use strict';

import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentContent } from '../../../common/ComponentContent';
import { ComponentFactory } from '../../../common/ComponentFactory';
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

  component: ComponentContent;
  componentStates: any[];
  isGradable: boolean;
  latestComponentState: any;
  latestComponentStateId: number;
  teacherWorkgroupId: number;

  constructor(
    private dialog: MatDialog,
    private ConfigService: ConfigService,
    private ProjectService: TeacherProjectService,
    private TeacherDataService: TeacherDataService
  ) {}

  ngOnInit() {
    this.teacherWorkgroupId = this.ConfigService.getWorkgroupId();
    this.component = this.ProjectService.getComponent(this.nodeId, this.componentId);
    const factory = new ComponentFactory();
    const component = factory.getComponent(this.component, this.nodeId);
    this.isGradable = component.isGradable();
    this.componentStates = this.TeacherDataService.getComponentStatesByWorkgroupIdAndComponentId(
      this.workgroupId,
      this.componentId
    );
    this.latestComponentState = this.TeacherDataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(
      this.workgroupId,
      this.nodeId,
      this.componentId
    );
    if (this.latestComponentState != null) {
      this.latestComponentStateId = this.latestComponentState.id;
    }
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
      panelClass: ['app-styles', 'dialog-lg']
    });
  }
}
