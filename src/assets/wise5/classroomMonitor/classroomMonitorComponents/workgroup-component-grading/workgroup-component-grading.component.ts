import { Component, Input, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ComponentContent } from '../../../common/ComponentContent';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ViewComponentRevisionsComponent } from '../view-component-revisions/view-component-revisions.component';
import { ComponentStateInfoComponent } from '../../../common/component-state-info/component-state-info.component';
import { ComponentGradingComponent } from '../component-grading.component';
import { EditComponentAnnotationsComponent } from '../edit-component-annotations/edit-component-annotations.component';

@Component({
  imports: [
    ComponentGradingComponent,
    ComponentStateInfoComponent,
    EditComponentAnnotationsComponent,
    MatDialogModule
  ],
  selector: 'workgroup-component-grading',
  templateUrl: 'workgroup-component-grading.component.html'
})
export class WorkgroupComponentGradingComponent {
  private configService = inject(ConfigService);
  private dataService = inject(TeacherDataService);
  private dialog = inject(MatDialog);
  private projectService = inject(TeacherProjectService);

  protected component: ComponentContent;
  @Input() componentId: string;
  protected componentStates: any[];
  protected isGradable: boolean;
  protected latestComponentState: any;
  protected latestComponentStateId: number;
  @Input() nodeId: string;
  protected teacherWorkgroupId: number;
  @Input() workgroupId: number;

  ngOnInit(): void {
    this.teacherWorkgroupId = this.configService.getWorkgroupId();
    this.component = this.projectService.getComponent(this.nodeId, this.componentId);
    const factory = new ComponentFactory();
    const component = factory.getComponent(this.component, this.nodeId);
    this.isGradable = component.isGradable();
    this.componentStates = this.dataService.getComponentStatesByWorkgroupIdAndComponentId(
      this.workgroupId,
      this.componentId
    );
    this.latestComponentState =
      this.dataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(
        this.workgroupId,
        this.nodeId,
        this.componentId
      );
    if (this.latestComponentState != null) {
      this.latestComponentStateId = this.latestComponentState.id;
    }
  }

  protected showRevisions(): void {
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
