import * as angular from 'angular';

export default angular.module('nodeAuthoringModule', []).config([
  '$stateProvider',
  ($stateProvider) => {
    $stateProvider
      .state('root.at.project.node', {
        url: '/node/:nodeId',
        component: 'nodeAuthoringComponent',
        resolve: {
          node: [
            'ProjectService',
            '$stateParams',
            (ProjectService, $stateParams) => {
              return ProjectService.getNode($stateParams.nodeId);
            }
          ]
        },
        params: {
          newComponents: []
        }
      })
      .state('root.at.project.node.advanced', {
        url: '/advanced',
        component: 'nodeAdvancedAuthoringComponent'
      })
      .state('root.at.project.node.advanced.branch', {
        url: '/branch',
        component: 'nodeAdvancedBranchAuthoringComponent'
      })
      .state('root.at.project.node.advanced.constraint', {
        url: '/constraint',
        component: 'nodeAdvancedConstraintAuthoringComponent'
      })
      .state('root.at.project.node.advanced.general', {
        url: '/general',
        component: 'nodeAdvancedGeneralAuthoringComponent'
      })
      .state('root.at.project.node.advanced.json', {
        url: '/json',
        component: 'nodeAdvancedJsonAuthoringComponent'
      })
      .state('root.at.project.node.advanced.path', {
        url: '/path',
        component: 'nodeAdvancedPathAuthoringComponent'
      })
      .state('root.at.project.node.advanced.rubric', {
        url: '/rubric',
        component: 'editNodeRubricComponent'
      })
      .state('root.at.project.node.choose-component-location', {
        url: '/choose-component-location',
        component: 'chooseComponentLocationComponent',
        params: {
          action: 'move',
          selectedComponents: []
        }
      });
  }
]);
