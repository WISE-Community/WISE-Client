import { downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';
import { ComponentServiceLookupService } from '../../services/componentServiceLookupService';
import { DataExportService } from '../../services/dataExportService';

export default angular
  .module('dataExport', ['ngFileSaver'])
  .factory('DataExportService', downgradeInjectable(DataExportService))
  .factory('ComponentServiceLookupService', downgradeInjectable(ComponentServiceLookupService))
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider
        .state('root.cm.export', {
          url: '/export',
          component: 'dataExport'
        })
        .state('root.cm.exportVisits', {
          url: '/export/visits',
          component: 'exportStepVisits'
        });
    }
  ]);
