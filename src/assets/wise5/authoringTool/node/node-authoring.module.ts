import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { NodeAdvancedAuthoringComponent } from './advanced/node-advanced-authoring.component';
import { NodeAdvancedBranchAuthoringComponent } from './advanced/branch/node-advanced-branch-authoring.component';
import { NodeAdvancedConstraintAuthoringComponent } from './advanced/constraint/node-advanced-constraint-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from './advanced/general/node-advanced-general-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from './advanced/json/node-advanced-json-authoring.component';
import { NodeAdvancedPathAuthoringComponent } from './advanced/path/node-advanced-path-authoring.component';
import { NodeAuthoringComponent } from './nodeAuthoringComponent';

export default angular
  .module('nodeAuthoringModule', [])
  .component('nodeAdvancedAuthoringComponent', NodeAdvancedAuthoringComponent)
  .component('nodeAdvancedBranchAuthoringComponent', NodeAdvancedBranchAuthoringComponent)
  .component('nodeAdvancedConstraintAuthoringComponent', NodeAdvancedConstraintAuthoringComponent)
  .component('nodeAdvancedPathAuthoringComponent', NodeAdvancedPathAuthoringComponent)
  .directive(
    'nodeAdvancedGeneralAuthoringComponent',
    downgradeComponent({
      component: NodeAdvancedGeneralAuthoringComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'nodeAdvancedJsonAuthoringComponent',
    downgradeComponent({
      component: NodeAdvancedJsonAuthoringComponent
    }) as angular.IDirectiveFactory
  )
  .component('nodeAuthoringComponent', NodeAuthoringComponent)
  .config([
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
        });
    }
  ]);
