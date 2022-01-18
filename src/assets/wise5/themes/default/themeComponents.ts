'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { HelpIconComponent } from './themeComponents/helpIcon/help-icon.component';
import { NodeStatusIcon } from './themeComponents/nodeStatusIcon/node-status-icon.component';
import { StepToolsComponent } from './themeComponents/stepTools/step-tools.component';

const ThemeComponents = angular
  .module('theme.components', [])
  .directive(
    'helpIcon',
    downgradeComponent({ component: HelpIconComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'nodeStatusIcon',
    downgradeComponent({ component: NodeStatusIcon }) as angular.IDirectiveFactory
  )
  .directive(
    'stepTools',
    downgradeComponent({ component: StepToolsComponent }) as angular.IDirectiveFactory
  );

export default ThemeComponents;
