'use strict';

import { Injectable } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { ProjectService } from './projectService';

@Injectable()
export class NodeInfoService {
  constructor(private upgrade: UpgradeModule, private projectService: ProjectService) {}

  showNodeInfo(nodeId, $event) {
    let stepNumberAndTitle = this.projectService.getNodePositionAndTitle(nodeId);
    let rubricTitle = $localize`Step Info`;

    /*
     * create the dialog header, actions, and content elements
     */
    let dialogHeader = `<md-toolbar>
                <div class="md-toolbar-tools">
                    <h2>${stepNumberAndTitle}</h2>
                </div>
            </md-toolbar>`;

    let dialogActions = `<md-dialog-actions layout="row" layout-align="end center">
                <md-button class="md-primary" ng-click="openInNewWindow()" aria-label="{{ 'openInNewWindow' | translate }}">{{ 'openInNewWindow' | translate }}</md-button>
                <md-button class="md-primary" ng-click="close()" aria-label="{{ 'close' | translate }}">{{ 'close' | translate }}</md-button>
            </md-dialog-actions>`;

    let dialogContent = `<md-dialog-content class="gray-lighter-bg">
                <div class="md-dialog-content" id="nodeInfo_${nodeId}">
                    <node-info node-id="${nodeId}"></node-info>
                </div>
            </md-dialog-content>`;

    let dialogString = `<md-dialog class="dialog--wider" aria-label="${stepNumberAndTitle} - ${rubricTitle}">${dialogHeader}${dialogContent}${dialogActions}</md-dialog>`;

    // display the node info in a popup
    this.upgrade.$injector.get('$mdDialog').show({
      template: dialogString,
      fullscreen: true,
      multiple: true,
      controller: [
        '$scope',
        '$mdDialog',
        function DialogController($scope, $mdDialog) {
          // display the node info in a new tab
          $scope.openInNewWindow = function () {
            // open a new tab
            let w = window.open('', '_blank');

            /*
             * create the header for the new window that contains the project title
             */
            let windowHeader = `<md-toolbar class="layout-row">
                                <div class="md-toolbar-tools primary-bg" style="color: #ffffff;">
                                    <h2>${stepNumberAndTitle}</h2>
                                </div>
                            </md-toolbar>`;

            let rubricContent = document.getElementById('nodeInfo_' + nodeId).innerHTML;

            // create the window string
            let windowString = `<link rel='stylesheet' href='/wise5/themes/default/style/monitor.css'>
                            <link rel='stylesheet' href='/wise5/themes/default/style/angular-material.css'>
                            <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic%7CMaterial+Icons" media="all">
                            <body class="layout-column">
                                <div class="layout-column">${windowHeader}<md-content class="md-padding">${rubricContent}</div></md-content></div>
                            </body>`;
            w.document.write(windowString);
            $mdDialog.hide();
          };
          $scope.close = () => {
            $mdDialog.hide();
          };
        }
      ],
      targetEvent: $event,
      clickOutsideToClose: true,
      escapeToClose: true
    });
  }
}
