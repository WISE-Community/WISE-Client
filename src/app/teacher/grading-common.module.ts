import { NgModule } from '@angular/core';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { EditComponentAnnotationsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-annotations/edit-component-annotations.component';
import { WorkgroupInfoComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/workgroupInfo/workgroup-info.component';
import { WorkgroupNodeScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/workgroupNodeScore/workgroup-node-score.component';
import { WorkgroupComponentGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/workgroup-component-grading/workgroup-component-grading.component';
import { WorkgroupNodeStatusComponent } from '../classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupSelectAutocompleteComponent } from '../classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { NavItemProgressComponent } from '../classroom-monitor/nav-item-progress/nav-item-progress.component';
import { ComponentStateInfoComponent } from '../../assets/wise5/common/component-state-info/component-state-info.component';
import { StudentTeacherCommonServicesModule } from '../student-teacher-common-services.module';

@NgModule({
  imports: [
    ComponentStateInfoComponent,
    EditComponentAnnotationsComponent,
    IntersectionObserverModule,
    NavItemProgressComponent,
    StudentTeacherCommonServicesModule,
    WorkgroupInfoComponent,
    WorkgroupComponentGradingComponent,
    WorkgroupNodeScoreComponent,
    WorkgroupNodeStatusComponent,
    WorkgroupSelectAutocompleteComponent
  ],
  exports: [
    ComponentStateInfoComponent,
    EditComponentAnnotationsComponent,
    IntersectionObserverModule,
    NavItemProgressComponent,
    WorkgroupComponentGradingComponent,
    WorkgroupInfoComponent,
    WorkgroupNodeScoreComponent,
    WorkgroupNodeStatusComponent,
    WorkgroupSelectAutocompleteComponent
  ]
})
export class GradingCommonModule {}
