'use strict';

import * as angular from 'angular';
import Compile from './compile/compile';
import DisableDeleteKeypress from './disableDeleteKeypress/disableDeleteKeypress';
import Draggable from './draggable/draggable';
import GlobalAnnotations from './globalAnnotations/globalAnnotations';
import GlobalAnnotationsList from './globalAnnotationsList/globalAnnotationsList';
import ListenForDeleteKeypress from './listenForDeleteKeypress/listenForDeleteKeypress';
import MilestoneReportGraph from './milestoneReportGraph/milestoneReportGraph';
import Sticky from './sticky/sticky';
import { downgradeComponent } from '@angular/upgrade/static';
import { NodeIconComponent } from '../classroomMonitor/classroomMonitorComponents/shared/nodeIcon/node-icon.component';
import { MilestoneReportDataComponent } from '../../../app/teacher/milestone/milestone-report-data/milestone-report-data.component';
import { PossibleScoreComponent } from '../../../app/possible-score/possible-score.component';
import { SummaryDisplay } from './summaryDisplay/summary-display.component';
import { ComponentComponent } from '../components/component/component.component';

const Components = angular.module('components', []);

Components.component('compile', Compile);
Components.directive(
  'component',
  downgradeComponent({ component: ComponentComponent }) as angular.IDirectiveFactory
);
Components.component('disableDeleteKeypress', DisableDeleteKeypress);
Components.component('draggable', Draggable);
Components.component('globalAnnotations', GlobalAnnotations);
Components.component('globalAnnotationsList', GlobalAnnotationsList);
Components.component('listenForDeleteKeypress', ListenForDeleteKeypress);
Components.directive(
  'milestoneReportData',
  downgradeComponent({ component: MilestoneReportDataComponent }) as angular.IDirectiveFactory
);
Components.component('milestoneReportGraph', MilestoneReportGraph);
Components.directive(
  'nodeIcon',
  downgradeComponent({ component: NodeIconComponent }) as angular.IDirectiveFactory
);
Components.directive(
  'possibleScore',
  downgradeComponent({ component: PossibleScoreComponent }) as angular.IDirectiveFactory
);
Components.directive(
  'summaryDisplay',
  downgradeComponent({ component: SummaryDisplay }) as angular.IDirectiveFactory
);
Components.directive('sticky', Sticky);

export default Components;
