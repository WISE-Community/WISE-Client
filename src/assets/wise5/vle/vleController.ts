'use strict';

import { AnnotationService } from '../services/annotationService';
import { ConfigService } from '../services/configService';
import { NotebookService } from '../services/notebookService';
import { NotificationService } from '../services/notificationService';
import { VLEProjectService } from './vleProjectService';
import { SessionService } from '../services/sessionService';
import { StudentDataService } from '../services/studentDataService';
import * as angular from 'angular';
import * as $ from 'jquery';
import { Directive } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive()
class VLEController {
  $translate: any;
  connectionLostDisplay: any;
  connectionLostShown: boolean = false;
  constraintsDisabled: boolean = false;
  currentNode: any;
  homePath: string;
  idToOrder: any;
  layoutState: string;
  layoutView: string;
  nodeStatuses: any[];
  navFilter: any;
  navFilters: any;
  newNotifications: any;
  notebookConfig: any;
  notebookFilter: string = '';
  notebookItemPath: string;
  notebookNavOpen: boolean;
  notebookOpen: boolean = false;
  noteDialog: any;
  notesEnabled: boolean = false;
  notesVisible: boolean = false;
  notifications: any;
  numberProject: boolean;
  pauseDialog: any;
  projectName: string;
  projectStyle: string;
  reportEnabled: boolean = false;
  reportFullscreen: boolean = false;
  rootNode: any;
  rootNodeStatus: any;
  subscriptions: Subscription = new Subscription();
  themePath: string;
  themeSettings: any;
  workgroupId: number;

  static $inject = [
    '$anchorScroll',
    '$scope',
    '$filter',
    '$mdDialog',
    '$mdToast',
    '$state',
    '$transitions',
    '$window',
    'AnnotationService',
    'ConfigService',
    'NotebookService',
    'NotificationService',
    'ProjectService',
    'SessionService',
    'StudentDataService'
  ];

  constructor(
    private $anchorScroll: any,
    private $scope: any,
    private $filter: any,
    private $mdDialog: any,
    private $mdToast: any,
    private $state: any,
    private $transitions: any,
    private $window: any,
    private AnnotationService: AnnotationService,
    private ConfigService: ConfigService,
    private NotebookService: NotebookService,
    private NotificationService: NotificationService,
    private ProjectService: VLEProjectService,
    private SessionService: SessionService,
    private StudentDataService: StudentDataService
  ) {
    this.$translate = this.$filter('translate');
    this.$window.onbeforeunload = () => {
      this.SessionService.broadcastExit();
    };

    this.workgroupId = this.ConfigService.getWorkgroupId();
    this.currentNode = null;
    this.pauseDialog = null;
    this.noteDialog = null;

    this.navFilters = this.ProjectService.getFilters();
    this.navFilter = this.navFilters[0].name;

    this.projectStyle = this.ProjectService.getStyle();
    this.projectName = this.ProjectService.getProjectTitle();
    if (this.NotebookService.isNotebookEnabled()) {
      this.notebookConfig = this.NotebookService.getStudentNotebookConfig();
      this.notesEnabled = this.notebookConfig.itemTypes.note.enabled;
      this.reportEnabled = this.notebookConfig.itemTypes.report.enabled;
    }

    let userType = this.ConfigService.getConfigParam('userType');
    let contextPath = this.ConfigService.getConfigParam('contextPath');
    if (userType == 'student') {
      this.homePath = contextPath + '/student';
    } else if (userType == 'teacher') {
      this.homePath = contextPath + '/teacher';
    } else {
      this.homePath = contextPath;
    }

    if (this.ConfigService.getConfigParam('constraints') == false) {
      this.constraintsDisabled = true;
    }

    let script = this.ProjectService.getProjectScript();
    if (script != null) {
      this.ProjectService.retrieveScript(script).then((script: string) => {
        new Function(script).call(this);
      });
    }

    this.subscriptions.add(
      this.SessionService.showSessionWarning$.subscribe(() => {
        const confirm = $mdDialog
          .confirm()
          .parent(angular.element(document.body))
          .title(this.$translate('SESSION_TIMEOUT'))
          .content(this.$translate('SESSION_TIMEOUT_MESSAGE'))
          .ariaLabel(this.$translate('SESSION_TIMEOUT'))
          .ok(this.$translate('YES'))
          .cancel(this.$translate('NO'));
        $mdDialog.show(confirm).then(
          () => {
            this.SessionService.closeWarningAndRenewSession();
          },
          () => {
            this.logOut();
          }
        );
      })
    );

    this.subscriptions.add(
      this.SessionService.logOut$.subscribe(() => {
        this.logOut();
      })
    );

    this.subscriptions.add(
      this.StudentDataService.currentNodeChanged$.subscribe(({ previousNode }) => {
        let currentNode = this.StudentDataService.getCurrentNode();
        let currentNodeId = currentNode.id;

        this.StudentDataService.updateStackHistory(currentNodeId);
        this.StudentDataService.updateVisitedNodesHistory(currentNodeId);

        let componentId, componentType, category, eventName, eventData, eventNodeId;
        if (previousNode != null && this.ProjectService.isGroupNode(previousNode.id)) {
          // going from group to node or group to group
          componentId = null;
          componentType = null;
          category = 'Navigation';
          eventName = 'nodeExited';
          eventData = {
            nodeId: previousNode.id
          };
          eventNodeId = previousNode.id;
          this.StudentDataService.saveVLEEvent(
            eventNodeId,
            componentId,
            componentType,
            category,
            eventName,
            eventData
          );
        }

        if (this.ProjectService.isGroupNode(currentNodeId)) {
          componentId = null;
          componentType = null;
          category = 'Navigation';
          eventName = 'nodeEntered';
          eventData = {
            nodeId: currentNode.id
          };
          eventNodeId = currentNode.id;
          this.StudentDataService.saveVLEEvent(
            eventNodeId,
            componentId,
            componentType,
            category,
            eventName,
            eventData
          );
        }
      })
    );

    this.$transitions.onSuccess({}, ($transition) => {
      this.$anchorScroll('node');
    });

    this.processNotifications();
    this.subscriptions.add(
      this.NotificationService.notificationChanged$.subscribe(() => {
        // update new notifications
        this.processNotifications();
      })
    );

    this.subscriptions.add(
      this.StudentDataService.pauseScreen$.subscribe((doPause: boolean) => {
        if (doPause) {
          this.pauseScreen();
        } else {
          this.unPauseScreen();
        }
      })
    );

    this.subscriptions.add(
      this.NotebookService.notesVisible$.subscribe((notesVisible: boolean) => {
        this.notesVisible = notesVisible;
      })
    );

    this.subscriptions.add(
      this.NotebookService.reportFullScreen$.subscribe((full: boolean) => {
        this.reportFullscreen = full;
      })
    );

    // Make sure if we drop something on the page we don't navigate away
    // https://developer.mozilla.org/En/DragDrop/Drag_Operations#drop
    $(document.body).on('dragover', function (e) {
      e.preventDefault();
      return false;
    });

    $(document.body).on('drop', function (e) {
      e.preventDefault();
      return false;
    });

    this.themePath = this.ProjectService.getThemePath();
    this.notebookItemPath = this.themePath + '/notebook/notebookItem.html';

    let nodeId = null;
    let stateParams = null;
    let stateParamNodeId = null;

    if (this.$state != null) {
      stateParams = this.$state.params;
    }

    if (stateParams != null) {
      stateParamNodeId = stateParams.nodeId;
    }

    if (stateParamNodeId != null && stateParamNodeId !== '') {
      nodeId = stateParamNodeId;
    } else {
      /*
       * get the node id for the latest node entered event for an active
       * node that exists in the project
       */
      nodeId = this.StudentDataService.getLatestNodeEnteredEventNodeIdWithExistingNode();
    }

    if (nodeId == null || nodeId === '') {
      nodeId = this.ProjectService.getStartNodeId();
    }

    this.StudentDataService.setCurrentNodeByNodeId(nodeId);

    const runStatus = this.StudentDataService.getRunStatus();
    if (runStatus != null) {
      let pause = false;
      const periodId = this.ConfigService.getPeriodId();
      if (periodId != null) {
        const periods = runStatus.periods;
        if (periods != null) {
          for (const tempPeriod of periods) {
            if (periodId === tempPeriod.periodId) {
              if (tempPeriod.paused) {
                pause = true;
                break;
              }
            }
          }
        }
      }

      if (pause) {
        this.pauseScreen();
      }
    }

    this.$mdToast = $mdToast;

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

    this.notebookConfig = this.NotebookService.getNotebookConfig();
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

    this.setLayoutState();

    // update layout state when current node changes
    this.subscriptions.add(
      this.StudentDataService.currentNodeChanged$.subscribe(() => {
        this.currentNode = this.StudentDataService.getCurrentNode();
        this.setLayoutState();
      })
    );

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
            message = `<p>
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
      })
    );

    this.subscriptions.add(
      this.NotificationService.serverConnectionStatus$.subscribe((isConnected) => {
        if (isConnected) {
          this.handleServerReconnect();
        } else {
          this.handleServerDisconnect();
        }
      })
    );

    // handle request for notification dismiss codes
    this.subscriptions.add(
      this.NotificationService.viewCurrentAmbientNotification$.subscribe((args) => {
        this.NotificationService.displayAmbientNotification(args.notification);
      })
    );

    this.$scope.$on('$destroy', () => {
      this.ngOnDestroy();
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  processNotifications(): void {
    this.notifications = this.NotificationService.notifications;
    this.newNotifications = this.NotificationService.getNewNotifications();
  }

  logOut(eventName = 'logOut') {
    const nodeId = null;
    const componentId = null;
    const componentType = null;
    const category = 'Navigation';
    const event = eventName;
    const eventData = {};
    this.StudentDataService.saveVLEEvent(
      nodeId,
      componentId,
      componentType,
      category,
      event,
      eventData
    ).then(() => {
      this.SessionService.logOut();
    });
  }

  loadRoot() {
    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(
      this.ProjectService.rootNode.id
    );
  }

  mouseMoved() {
    this.SessionService.mouseMoved();
  }

  pauseScreen() {
    // TODO: i18n
    this.pauseDialog = this.$mdDialog.show({
      template:
        '<md-dialog aria-label="Screen Paused"><md-dialog-content><div class="md-dialog-content center">' +
        this.$translate('yourTeacherHasPausedAllTheScreensInTheClass') +
        '</div></md-dialog-content></md-dialog>',
      escapeToClose: false
    });
  }

  unPauseScreen() {
    this.$mdDialog.hide();
    this.pauseDialog = null;
  }

  isPreview() {
    return this.ConfigService.isPreview();
  }

  /**
   * Returns WISE API
   */
  getWISEAPI() {
    return {
      /**
       * Registers a function that will be invoked before the componentState is saved to the server
       * @param nodeId the node id
       * @param componentId the component id
       * @param additionalProcessingFunction the function to register for the specified node and component
       */
      registerAdditionalProcessingFunction: (nodeId, componentId, additionalProcessingFunction) => {
        this.ProjectService.addAdditionalProcessingFunction(
          nodeId,
          componentId,
          additionalProcessingFunction
        );
      },
      /**
       * Create an auto score annotation
       * @param runId the run id
       * @param periodId the period id
       * @param nodeId the node id
       * @param componentId the component id
       * @param toWorkgroupId the student workgroup id
       * @param data the annotation data
       * @returns the auto score annotation
       */
      createAutoScoreAnnotation: (nodeId, componentId, data) => {
        let runId = this.ConfigService.getRunId();
        let periodId = this.ConfigService.getPeriodId();
        let toWorkgroupId = this.ConfigService.getWorkgroupId();

        return this.AnnotationService.createAutoScoreAnnotation(
          runId,
          periodId,
          nodeId,
          componentId,
          toWorkgroupId,
          data
        );
      },
      /**
       * Create an auto comment annotation
       * @param runId the run id
       * @param periodId the period id
       * @param nodeId the node id
       * @param componentId the component id
       * @param toWorkgroupId the student workgroup id
       * @param data the annotation data
       * @returns the auto comment annotation
       */
      createAutoCommentAnnotation: (nodeId, componentId, data) => {
        let runId = this.ConfigService.getRunId();
        let periodId = this.ConfigService.getPeriodId();
        let toWorkgroupId = this.ConfigService.getWorkgroupId();

        return this.AnnotationService.createAutoCommentAnnotation(
          runId,
          periodId,
          nodeId,
          componentId,
          toWorkgroupId,
          data
        );
      },
      /**
       * Gets the latest annotation for the specified node, component, and type
       * @param nodeId
       * @param componentId
       * @param annotationType
       * @returns {the|Object}
       */
      getLatestAnnotationForComponent: (nodeId, componentId, annotationType) => {
        let params = {
          nodeId: nodeId,
          componentId: componentId,
          type: annotationType
        };
        return this.AnnotationService.getLatestAnnotation(params);
      },
      /**
       * Updates the annotation locally and on the server
       * @param annotation
       */
      updateAnnotation: (annotation) => {
        this.AnnotationService.saveAnnotation(annotation);
      },
      /**
       * Returns the maxScore for the specified node and component
       * @param nodeId the node id
       * @param componentId the component id
       * @returns the max score for the component
       */
      getMaxScoreForComponent: (nodeId, componentId) => {
        return this.ProjectService.getMaxScoreForComponent(nodeId, componentId);
      }
    };
  }

  /**
   * Set the layout state of the vle
   * @param state string specifying state (e.g. 'notebook'; optional)
   */
  setLayoutState(state: string = null) {
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
}

export default VLEController;
