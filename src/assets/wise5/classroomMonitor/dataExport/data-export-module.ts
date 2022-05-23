import { downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';
import { ComponentServiceLookupService } from '../../services/componentServiceLookupService';
import { DataExportService } from '../../services/dataExportService';
import DataExportController from './dataExportController';
import ExportController from './exportController';
import ExportVisitsController from './exportVisitsController';

export default angular
  .module('dataExport', ['ngFileSaver'])
  .factory('DataExportService', downgradeInjectable(DataExportService))
  .factory('ComponentServiceLookupService', downgradeInjectable(ComponentServiceLookupService))
  .controller('DataExportController', DataExportController)
  .controller('ExportController', ExportController)
  .controller('ExportVisitsController', ExportVisitsController)
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider
        .state('root.cm.export', {
          url: '/export',
          templateUrl: '/assets/wise5/classroomMonitor/dataExport/dataExport.html',
          controller: 'DataExportController',
          controllerAs: 'dataExportController'
        })
        .state('root.cm.exportVisits', {
          url: '/export/visits',
          templateUrl: '/assets/wise5/classroomMonitor/dataExport/exportVisits.html',
          controller: 'ExportVisitsController',
          controllerAs: 'exportVisitsController'
        });
    }
  ]);
