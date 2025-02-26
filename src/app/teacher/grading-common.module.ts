import { NgModule } from '@angular/core';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { EditComponentAnnotationsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-annotations/edit-component-annotations.component';
import { WorkgroupItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/workgroup-item/workgroup-item.component';
import { WorkgroupInfoComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/workgroupInfo/workgroup-info.component';
import { WorkgroupNodeScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/workgroupNodeScore/workgroup-node-score.component';
import { WorkgroupComponentGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/workgroup-component-grading/workgroup-component-grading.component';
import { WorkgroupNodeStatusComponent } from '../classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupSelectAutocompleteComponent } from '../classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { StatusIconComponent } from '../classroom-monitor/status-icon/status-icon.component';
import { NavItemProgressComponent } from '../classroom-monitor/nav-item-progress/nav-item-progress.component';
import { ComponentGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/component-grading.component';
import { ComponentStateInfoComponent } from '../../assets/wise5/common/component-state-info/component-state-info.component';
import { ComponentClassResponsesComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/component-class-responses/component-class-responses.component';

@NgModule({
  imports: [
    ComponentClassResponsesComponent,
    ComponentGradingComponent,
    ComponentStateInfoComponent,
    EditComponentAnnotationsComponent,
    IntersectionObserverModule,
    NavItemProgressComponent,
    StatusIconComponent,
    StudentTeacherCommonModule,
    WorkgroupInfoComponent,
    WorkgroupItemComponent,
    WorkgroupComponentGradingComponent,
    WorkgroupNodeScoreComponent,
    WorkgroupNodeStatusComponent,
    WorkgroupSelectAutocompleteComponent
  ],
  exports: [
    ComponentClassResponsesComponent,
    ComponentGradingComponent,
    ComponentStateInfoComponent,
    EditComponentAnnotationsComponent,
    IntersectionObserverModule,
    NavItemProgressComponent,
    StatusIconComponent,
    WorkgroupComponentGradingComponent,
    WorkgroupInfoComponent,
    WorkgroupItemComponent,
    WorkgroupNodeScoreComponent,
    WorkgroupNodeStatusComponent,
    WorkgroupSelectAutocompleteComponent
  ]
})
export class GradingCommonModule {}
