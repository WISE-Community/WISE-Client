import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';
import { ComponentServiceLookupService } from '../../services/componentServiceLookupService';
import { DataExportService } from '../../services/dataExportService';
import DataExportController from './dataExportController';
import { ExportStepVisitsComponent } from './export-step-visits/export-step-visits.component';

export default angular
  .module('dataExport', ['ngFileSaver'])
  .factory('DataExportService', downgradeInjectable(DataExportService))
  .factory('ComponentServiceLookupService', downgradeInjectable(ComponentServiceLookupService))
  .controller('DataExportController', DataExportController)
  .directive('exportStepVisits', downgradeComponent({ component: ExportStepVisitsComponent }))
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
          component: 'exportStepVisits'
        });
    }
  ]);
