'use strict';

import * as angular from 'angular';
import Compile from './compile/compile';
import DisableDeleteKeypress from './disableDeleteKeypress/disableDeleteKeypress';
import Draggable from './draggable/draggable';
import MilestoneReportGraph from './milestoneReportGraph/milestoneReportGraph';
import Sticky from './sticky/sticky';
import { downgradeComponent } from '@angular/upgrade/static';
import { MilestoneReportDataComponent } from '../../../app/teacher/milestone/milestone-report-data/milestone-report-data.component';
import { PossibleScoreComponent } from '../../../app/possible-score/possible-score.component';
import { ComponentComponent } from '../components/component/component.component';
import { TeacherSummaryDisplay } from './teacher-summary-display/teacher-summary-display.component';
import { TeacherNodeIconComponent } from '../authoringTool/teacher-node-icon/teacher-node-icon.component';

const Components = angular.module('components', []);

Components.component('compile', Compile);
Components.directive(
  'component',
  downgradeComponent({ component: ComponentComponent }) as angular.IDirectiveFactory
);
Components.component('disableDeleteKeypress', DisableDeleteKeypress);
Components.component('draggable', Draggable);
Components.directive(
  'milestoneReportData',
  downgradeComponent({ component: MilestoneReportDataComponent }) as angular.IDirectiveFactory
);
Components.component('milestoneReportGraph', MilestoneReportGraph);
Components.directive(
  'nodeIcon',
  downgradeComponent({ component: TeacherNodeIconComponent }) as angular.IDirectiveFactory
);
Components.directive(
  'possibleScore',
  downgradeComponent({ component: PossibleScoreComponent }) as angular.IDirectiveFactory
);
Components.directive(
  'teacherSummaryDisplay',
  downgradeComponent({ component: TeacherSummaryDisplay }) as angular.IDirectiveFactory
);
Components.directive('sticky', Sticky);

export default Components;
