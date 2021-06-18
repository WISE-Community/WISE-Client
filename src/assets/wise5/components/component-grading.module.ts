import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';
import { EditComponentCommentComponent } from '../classroomMonitor/classroomMonitorComponents/edit-component-comment/edit-component-comment.component';
import { EditComponentScoreComponent } from '../classroomMonitor/classroomMonitorComponents/edit-component-score/edit-component-score.component';
import { GradingEditComponentMaxScoreComponent } from '../classroomMonitor/classroomMonitorComponents/grading-edit-component-max-score/grading-edit-component-max-score.component';
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
  );
