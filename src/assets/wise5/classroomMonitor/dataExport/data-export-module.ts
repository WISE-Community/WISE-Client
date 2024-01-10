import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';
import { ComponentServiceLookupService } from '../../services/componentServiceLookupService';
import { DataExportService } from '../../services/dataExportService';
import { DataExportComponent } from './data-export/data-export.component';
import { ExportStepVisitsComponent } from './export-step-visits/export-step-visits.component';

export default angular
  .module('dataExport', ['ngFileSaver'])
  .factory('DataExportService', downgradeInjectable(DataExportService))
  .factory('ComponentServiceLookupService', downgradeInjectable(ComponentServiceLookupService))
  .directive('dataExport', downgradeComponent({ component: DataExportComponent }))
  .directive('exportStepVisits', downgradeComponent({ component: ExportStepVisitsComponent }))
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
