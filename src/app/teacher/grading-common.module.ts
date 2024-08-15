import { NgModule } from '@angular/core';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { EditComponentAnnotationsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-annotations/edit-component-annotations.component';
import { EditComponentCommentComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-comment/edit-component-comment.component';
import { EditComponentScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-score/edit-component-score.component';
import { GradingEditComponentMaxScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/grading-edit-component-max-score/grading-edit-component-max-score.component';
import { WorkgroupItemComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/workgroup-item/workgroup-item.component';
import { WorkgroupInfoComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/workgroupInfo/workgroup-info.component';
import { WorkgroupNodeScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/workgroupNodeScore/workgroup-node-score.component';
import { WorkgroupComponentGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/workgroup-component-grading/workgroup-component-grading.component';
import { WorkgroupNodeStatusComponent } from '../classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupSelectAutocompleteComponent } from '../classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { StudentTeacherCommonModule } from '../student-teacher-common.module';
import { ComponentGradingModule } from './component-grading.module';
import { StatusIconComponent } from '../classroom-monitor/status-icon/status-icon.component';
import { NavItemProgressComponent } from '../classroom-monitor/nav-item-progress/nav-item-progress.component';

@NgModule({
  imports: [
    ComponentGradingModule,
    IntersectionObserverModule,
    StatusIconComponent,
    StudentTeacherCommonModule,
    WorkgroupNodeScoreComponent,
    WorkgroupNodeStatusComponent
  ],
  declarations: [
    EditComponentAnnotationsComponent,
    EditComponentCommentComponent,
    EditComponentScoreComponent,
    GradingEditComponentMaxScoreComponent,
    NavItemProgressComponent,
    WorkgroupComponentGradingComponent,
    WorkgroupInfoComponent,
    WorkgroupItemComponent,
    WorkgroupSelectAutocompleteComponent
  ],
  exports: [
    ComponentGradingModule,
    EditComponentAnnotationsComponent,
    EditComponentCommentComponent,
    EditComponentScoreComponent,
    GradingEditComponentMaxScoreComponent,
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
