'use strict';

import { Subscription } from 'rxjs';

class ThemeController {
  constructor(
    $scope,
    $state,
    $filter,
    ConfigService,
    ProjectService,
    StudentAssetService,
    StudentDataService,
    NotebookService,
    NotificationService,
    SessionService,
    $mdDialog,
    $mdMedia,
    $mdToast,
    $mdComponentRegistry
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$filter = $filter;
    this.ConfigService = ConfigService;
    this.ProjectService = ProjectService;
    this.StudentAssetService = StudentAssetService;
    this.StudentDataService = StudentDataService;
    this.NotebookService = NotebookService;
    this.NotificationService = NotificationService;
    this.SessionService = SessionService;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.$mdToast = $mdToast;
    this.$mdComponentRegistry = $mdComponentRegistry;
    this.$translate = this.$filter('translate');
    this.subscriptions = new Subscription();

    // TODO: set these variables dynamically from theme settings
    this.layoutView = 'list'; // 'list' or 'card'
    this.numberProject = true;

    this.themePath = this.ProjectService.getThemePath();
    this.themeSettings = this.ProjectService.getThemeSettings();

    this.nodeStatuses = this.StudentDataService.nodeStatuses;
    this.idToOrder = this.ProjectService.idToOrder;

    this.workgroupId = this.ConfigService.getWorkgroupId();

    this.rootNode = this.ProjectService.rootNode;
    this.rootNodeStatus = this.nodeStatuses[this.rootNode.id];

    this.notebookOpen = false;
    this.notebookConfig = this.NotebookService.getNotebookConfig();
    this.notebookFilter = '';
    this.currentNode = this.StudentDataService.getCurrentNode();

    // set current notebook type filter to first enabled type
    if (this.notebookConfig.enabled) {
      for (var type in this.notebookConfig.itemTypes) {
        let prop = this.notebookConfig.itemTypes[type];
        if (this.notebookConfig.itemTypes.hasOwnProperty(type) && prop.enabled) {
          this.notebookFilter = type;
          break;
        }
      }
    }

    // build server disconnect display
    this.connectionLostDisplay = $mdToast.build({
      template:
        "<md-toast>\
                      <span>{{ 'ERROR_CHECK_YOUR_INTERNET_CONNECTION' | translate }}</span>\
                      </md-toast>",
      hideDelay: 0
    });
    this.connectionLostShown = false;

    this.setLayoutState();

    // update layout state when current node changes
    this.subscriptions.add(this.StudentDataService.currentNodeChanged$
        .subscribe(() => {
      this.currentNode = this.StudentDataService.getCurrentNode();
      this.setLayoutState();
    }));

    this.subscriptions.add(
        this.StudentDataService.nodeClickLocked$.subscribe(({ nodeId }) => {
      let message = this.$translate('sorryYouCannotViewThisItemYet');
      const node = this.ProjectService.getNodeById(nodeId);
      if (node != null) {
        // get the constraints that affect this node
        const constraints = this.ProjectService.getConstraintsThatAffectNode(node);
        this.ProjectService.orderConstraints(constraints);

        if (constraints != null && constraints.length > 0) {
          // get the node title the student is trying to go to
          const nodeTitle = this.ProjectService.getNodePositionAndTitleByNodeId(nodeId);
          message =
            `<p>
              ${this.$translate('toVisitNodeTitleYouNeedTo', { nodeTitle: nodeTitle })}
            </p>
            <ul>`;
        }

        // loop through all the constraints that affect this node
        for (let c = 0; c < constraints.length; c++) {
          const constraint = constraints[c];

          // check if the constraint has been satisfied
          if (constraint != null && !this.StudentDataService.evaluateConstraint(constraint)) {
            // the constraint has not been satisfied and is still active
            // get the message that describes how to disable the constraint
            message += `<li>${this.ProjectService.getConstraintMessage(nodeId, constraint)}</li>`;
          }
        }
        message += `</ul>`;
      }

      this.$mdDialog.show(
        this.$mdDialog
          .alert()
          .parent(angular.element(document.body))
          .title(this.$translate('itemLocked'))
          .htmlContent(message)
          .ariaLabel(this.$translate('itemLocked'))
          .ok(this.$translate('ok'))
      );
    }));

    this.subscriptions.add(
        this.NotificationService.serverConnectionStatus$.subscribe((isConnected) => {
      if (isConnected) {
        this.handleServerReconnect();
      } else {
        this.handleServerDisconnect();
      }
    }));

    // handle request for notification dismiss codes
    this.subscriptions.add(
        this.NotificationService.viewCurrentAmbientNotification$.subscribe((args) => {
          this.NotificationService.displayAmbientNotification(args.notification);
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Set the layout state of the vle
   * @param state string specifying state (e.g. 'notebook'; optional)
   */
  setLayoutState(state) {
    let layoutState = 'nav'; // default layout state
    if (state) {
      layoutState = state;
    } else {
      // no state was sent, so set based on current node
      if (this.currentNode) {
        var id = this.currentNode.id;
        if (this.ProjectService.isApplicationNode(id)) {
          // currently viewing step, so show step view
          layoutState = 'node';
        } else if (this.ProjectService.isGroupNode(id)) {
          // currently viewing group node, so show navigation view
          layoutState = 'nav';
        }
      }
    }

    if (layoutState === 'notebook') {
      this.$state.go('root.notebook', { nodeId: this.currentNode.id });
    } else {
      this.notebookNavOpen = false;
      if (this.ConfigService.isPreview()) {
        this.$state.go('root.preview.node', {
          projectId: this.ConfigService.getProjectId(),
          nodeId: this.currentNode.id
        });
      } else {
        this.$state.go('root.run.node', {
          runId: this.ConfigService.getRunId(),
          nodeId: this.currentNode.id
        });
      }
    }

    this.layoutState = layoutState;
  }

  handleServerDisconnect() {
    if (!this.connectionLostShown) {
      this.$mdToast.show(this.connectionLostDisplay);
      this.connectionLostShown = true;
    }
  }

  handleServerReconnect() {
    this.$mdToast.hide(this.connectionLostDisplay);
    this.connectionLostShown = false;
  }

  getAvatarColorForWorkgroupId(workgroupId) {
    return this.ConfigService.getAvatarColorForWorkgroupId(workgroupId);
  }

  mouseMoved() {
    /*
     * notify the Session Service that the user has moved the mouse
     * so we can refresh the session
     */
    this.SessionService.mouseMoved();
  }
}

ThemeController.$inject = [
  '$scope',
  '$state',
  '$filter',
  'ConfigService',
  'ProjectService',
  'StudentAssetService',
  'StudentDataService',
  'NotebookService',
  'NotificationService',
  'SessionService',
  '$mdDialog',
  '$mdMedia',
  '$mdToast',
  '$mdComponentRegistry'
];

export default ThemeController;
