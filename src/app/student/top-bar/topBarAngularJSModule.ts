import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { TopBarComponent } from './top-bar.component';

const topBarAngularJSModule = angular
  .module('topBarAngularJSModule', [])
  .directive(
    'topBar',
    downgradeComponent({ component: TopBarComponent }) as angular.IDirectiveFactory
  );

export default topBarAngularJSModule;
