'use strict';
import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { StudentAssetsComponent } from './student-assets/student-assets.component';

const studentAssetModule = angular
  .module('studentAsset', [])
  .directive(
    'studentAssets',
    downgradeComponent({ component: StudentAssetsComponent }) as angular.IDirectiveFactory
  );

export default studentAssetModule;
