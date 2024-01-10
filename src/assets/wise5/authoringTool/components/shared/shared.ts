'use strict';

import { MainMenuComponent } from '../../../common/main-menu/main-menu.component';
import Toolbar from './toolbar/toolbar';
import TopBar from './topBar/topBar';
import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { PreviewComponentComponent } from '../preview-component/preview-component.component';
import { PreviewComponentButtonComponent } from '../preview-component-button/preview-component-button.component';

const SharedComponents = angular
  .module('atShared', [])
  .directive(
    'atMainMenu',
    downgradeComponent({ component: MainMenuComponent }) as angular.IDirectiveFactory
  )
  .component('atToolbar', Toolbar)
  .component('atTopBar', TopBar)
  .directive(
    'previewComponent',
    downgradeComponent({ component: PreviewComponentComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'previewComponentButton',
    downgradeComponent({ component: PreviewComponentButtonComponent }) as angular.IDirectiveFactory
  );

export default SharedComponents;
