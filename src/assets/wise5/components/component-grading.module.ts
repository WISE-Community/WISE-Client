import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';
import { ComponentStateInfoComponent } from '../classroomMonitor/classroomMonitorComponents/component-state-info/component-state-info.component';
import { EditComponentAnnotationsComponent } from '../classroomMonitor/classroomMonitorComponents/edit-component-annotations/edit-component-annotations.component';
import { EditComponentCommentComponent } from '../classroomMonitor/classroomMonitorComponents/edit-component-comment/edit-component-comment.component';
import { EditComponentScoreComponent } from '../classroomMonitor/classroomMonitorComponents/edit-component-score/edit-component-score.component';
import { GradingEditComponentMaxScoreComponent } from '../classroomMonitor/classroomMonitorComponents/grading-edit-component-max-score/grading-edit-component-max-score.component';
import { SelectPeriodComponent } from '../classroomMonitor/classroomMonitorComponents/select-period/select-period.component';
import { WorkgroupComponentGradingComponent } from '../classroomMonitor/classroomMonitorComponents/workgroup-component-grading/workgroup-component-grading.component';
import './animation/animationGradingComponentModule';
import './audioOscillator/audioOscillatorGradingComponentModule';
import './conceptMap/conceptMapGradingComponentModule';
import './discussion/discussionGradingComponentModule';
import './draw/drawGradingComponentModule';
import './embedded/embeddedGradingComponentModule';
import './graph/graphGradingComponentModule';
import './label/labelGradingComponentModule';
import './match/matchGradingComponentModule';
import './multipleChoice/multipleChoiceGradingComponentModule';
import './openResponse/openResponseGradingComponentModule';
import './table/tableGradingComponentModule';

export default angular
  .module('componentGrading', [
    'animationGradingComponentModule',
    'audioOscillatorGradingComponentModule',
    'conceptMapGradingComponentModule',
    'discussionGradingComponentModule',
    'drawGradingComponentModule',
    'embeddedGradingComponentModule',
    'graphGradingComponentModule',
    'labelGradingComponentModule',
    'matchGradingComponentModule',
    'multipleChoiceGradingComponentModule',
    'openResponseGradingComponentModule',
    'tableGradingComponentModule'
  ])
  .directive(
    'componentStateInfo',
    downgradeComponent({
      component: ComponentStateInfoComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentAnnotations',
    downgradeComponent({
      component: EditComponentAnnotationsComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentComment',
    downgradeComponent({
      component: EditComponentCommentComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'editComponentScore',
    downgradeComponent({
      component: EditComponentScoreComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'gradingEditComponentMaxScore',
    downgradeComponent({
      component: GradingEditComponentMaxScoreComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'selectPeriod',
    downgradeComponent({
      component: SelectPeriodComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'workgroupComponentGrading',
    downgradeComponent({
      component: WorkgroupComponentGradingComponent
    }) as angular.IDirectiveFactory
  );
