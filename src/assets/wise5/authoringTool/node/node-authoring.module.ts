import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { NodeAdvancedBranchAuthoringComponent } from './advanced/branch/node-advanced-branch-authoring.component';
import { NodeAdvancedConstraintAuthoringComponent } from './advanced/constraint/node-advanced-constraint-authoring.component';
import { NodeAdvancedGeneralAuthoringComponent } from './advanced/general/node-advanced-general-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from './advanced/json/node-advanced-json-authoring.component';
import { NodeAdvancedPathAuthoringComponent } from './advanced/path/node-advanced-path-authoring.component';
import { NodeAdvancedAuthoringComponent } from './advanced/node-advanced-authoring/node-advanced-authoring.component';
import { NodeAuthoringComponent } from './node-authoring/node-authoring.component';
import { EditNodeRubricComponent } from './editRubric/edit-node-rubric.component';
import { ChooseComponentLocationComponent } from './chooseComponentLocation/choose-component-location.component';

export default angular
  .module('nodeAuthoringModule', [])
  .directive(
    'chooseComponentLocationComponent',
    downgradeComponent({ component: ChooseComponentLocationComponent })
  )
  .directive(
    'nodeAdvancedAuthoringComponent',
    downgradeComponent({ component: NodeAdvancedAuthoringComponent })
  )
  .directive(
    'nodeAdvancedBranchAuthoringComponent',
    downgradeComponent({
      component: NodeAdvancedBranchAuthoringComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'nodeAdvancedConstraintAuthoringComponent',
    downgradeComponent({
      component: NodeAdvancedConstraintAuthoringComponent
    }) as angular.IDirectiveFactory
  )
  .directive(
    'nodeAdvancedPathAuthoringComponent',
    downgradeComponent({
      component: NodeAdvancedPathAuthoringComponent
    }) as angular.IDirectiveFactory
  )
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
  .directive(
    'editNodeRubricComponent',
    downgradeComponent({ component: EditNodeRubricComponent }) as angular.IDirectiveFactory
  )
  .directive(
    'nodeAuthoringComponent',
    downgradeComponent({ component: NodeAuthoringComponent }) as angular.IDirectiveFactory
  )
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
