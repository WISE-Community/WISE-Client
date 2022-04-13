'use strict';

import * as angular from 'angular';
import { TableService } from './tableService';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { EditTableAdvancedComponent } from './edit-table-advanced/edit-table-advanced.component';
import { TableAuthoring } from './table-authoring/table-authoring.component';
import { EditTableConnectedComponentsComponent } from './edit-table-connected-components/edit-table-connected-components.component';

const tableAuthoringComponentModule = angular
  .module('tableAuthoringComponentModule', [])
  .service('TableService', downgradeInjectable(TableService))
  .directive(
    'tableAuthoring',
    downgradeComponent({ component: TableAuthoring }) as angular.IDirectiveFactory
  )
  .directive(
    'editTableAdvanced',
    downgradeComponent({ component: EditTableAdvancedComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'editTableConnectedComponents',
    downgradeComponent({
      component: EditTableConnectedComponentsComponent
    }) as angular.IDirectiveFactory
  );

export default tableAuthoringComponentModule;
