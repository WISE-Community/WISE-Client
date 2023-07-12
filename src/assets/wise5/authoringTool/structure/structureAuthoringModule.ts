'use strict';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { JigsawComponent } from './jigsaw/jigsaw.component';
import { SelfDirectedInvestigationComponent } from './self-directed-investigation/self-directed-investigation.component';
import { KiCycleUsingOerComponent } from './ki-cycle-using-oer/ki-cycle-using-oer.component';
import { PeerReviewAndRevisionComponent } from './peer-review-and-revision/peer-review-and-revision.component';
import { ChooseStructureComponent } from './choose-structure/choose-structure.component';
import { ChooseStructureLocationComponent } from './choose-structure-location/choose-structure-location.component';

const structureAuthoringModule = angular
  .module('structureAuthoringModule', ['ui.router'])
  .directive(
    'chooseStructureLocation',
    downgradeComponent({ component: ChooseStructureLocationComponent })
  )
  .directive('chooseStructure', downgradeComponent({ component: ChooseStructureComponent }))
  .directive('jigsawComponent', downgradeComponent({ component: JigsawComponent }))
  .directive(
    'selfDirectedInvestigation',
    downgradeComponent({ component: SelfDirectedInvestigationComponent })
  )
  .directive(
    'peerReviewAndRevisionComponent',
    downgradeComponent({ component: PeerReviewAndRevisionComponent })
  )
  .directive('kiCycleUsingOer', downgradeComponent({ component: KiCycleUsingOerComponent }))
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider
        .state('root.at.project.structure', {
          url: '/structure',
          abstract: true,
          resolve: {}
        })
        .state('root.at.project.structure.choose', {
          url: '/choose',
          component: 'chooseStructure',
          params: {
            structure: null
          }
        })
        .state('root.at.project.structure.jigsaw', {
          url: '/jigsaw',
          component: 'jigsawComponent',
          params: {
            structure: null
          }
        })
        .state('root.at.project.structure.self-directed-investigation', {
          url: '/self-directed-investigation',
          component: 'selfDirectedInvestigation',
          params: {
            structure: null
          }
        })
        .state('root.at.project.structure.peer-review-and-revision', {
          url: '/peer-review-and-revision',
          component: 'peerReviewAndRevisionComponent',
          params: {
            structure: null
          }
        })
        .state('root.at.project.structure.ki-cycle-using-oer', {
          url: '/ki-cycle-using-oer',
          component: 'kiCycleUsingOer',
          params: {
            structure: null
          }
        })
        .state('root.at.project.structure.location', {
          url: '/location',
          component: 'chooseStructureLocation',
          params: {
            structure: null
          }
        });
    }
  ]);

export default structureAuthoringModule;
