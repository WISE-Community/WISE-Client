import ConfigureStructureController from '../../structure/configureStructureController';

export default class AutomatedAssessmentConfigureController extends ConfigureStructureController {
  node: any;
  importFromProjectId: number;

  static $inject = ['$filter', '$http', '$rootScope', '$state', '$stateParams', '$scope'];

  constructor($filter, $http, $rootScope, $state, $stateParams, $scope) {
    super($filter, $http, $rootScope, $state, $stateParams, $scope);
  }

  $onInit() {
    this.node = this.$stateParams.node;
    this.importFromProjectId = this.$stateParams.importFromProjectId;
  }

  back() {
    window.history.back();
  }

  next() {
    this.$state.go('root.at.project.import-step.choose-location', {
      importFromProjectId: this.importFromProjectId,
      selectedNodes: [this.node]
    });
  }
}
