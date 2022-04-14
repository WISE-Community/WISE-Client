import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AnnotationService } from '../services/annotationService';
import { ConfigService } from '../services/configService';
import { NotebookService } from '../services/notebookService';
import { NotificationService } from '../services/notificationService';
import { SessionService } from '../services/sessionService';
import { StudentDataService } from '../services/studentDataService';
import { VLEProjectService } from './vleProjectService';
import { DialogWithConfirmComponent } from '../directives/dialog-with-confirm/dialog-with-confirm.component';
import { UpgradeModule } from '@angular/upgrade/static';
import { DialogWithCloseComponent } from '../directives/dialog-with-close/dialog-with-close.component';
import { DialogWithoutCloseComponent } from '../directives/dialog-without-close/dialog-without-close.component';

@Component({
  selector: 'vle',
  templateUrl: './vle.component.html',
  styleUrls: ['./vle.component.scss']
})
export class VLEComponent implements OnInit {
  connectionLostShown: boolean = false;
  constraintsDisabled: boolean = false;
  currentNode: any;
  @ViewChild('drawer') public drawer: any;
  endedAndLockedMessage: string;
  homePath: string;
  idToOrder: any;
  isEndedAndLocked: boolean;
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

  constructor(
    private annotationService: AnnotationService,
    private configService: ConfigService,
    private dialog: MatDialog,
    private notebookService: NotebookService,
    private notificationService: NotificationService,
    private projectService: VLEProjectService,
    private sessionService: SessionService,
    private snackBar: MatSnackBar,
    private studentDataService: StudentDataService,
    private upgrade: UpgradeModule
  ) {
    this.workgroupId = this.configService.getWorkgroupId();
    this.navFilters = this.projectService.getFilters();
    this.navFilter = this.navFilters[0].name;
    this.projectStyle = this.projectService.getStyle();
    this.projectName = this.projectService.getProjectTitle();
    if (this.notebookService.isNotebookEnabled()) {
      this.notebookConfig = this.notebookService.getStudentNotebookConfig();
      this.notesEnabled = this.notebookConfig.itemTypes.note.enabled;
      this.reportEnabled = this.notebookConfig.itemTypes.report.enabled;
    }

    let userType = this.configService.getConfigParam('userType');
    let contextPath = this.configService.getConfigParam('contextPath');
    if (userType == 'student') {
      this.homePath = contextPath + '/student';
    } else if (userType == 'teacher') {
      this.homePath = contextPath + '/teacher';
    } else {
      this.homePath = contextPath;
    }

    if (this.configService.getConfigParam('constraints') == false) {
      this.constraintsDisabled = true;
    }

    this.isEndedAndLocked = this.configService.isEndedAndLocked();
    if (this.isEndedAndLocked) {
      const endDate = this.configService.getPrettyEndDate();
      this.endedAndLockedMessage = $localize`This unit ended on ${endDate}. You can no longer save new work.`;
    }

    let script = this.projectService.getProjectScript();
    if (script != null) {
      this.projectService.retrieveScript(script).then((script: string) => {
        new Function(script).call(this);
      });
    }

    this.subscriptions.add(
      this.sessionService.showSessionWarning$.subscribe(() => {
        this.dialog
          .open(DialogWithConfirmComponent, {
            data: {
              content: $localize`You have been inactive for a long time. Do you want to stay logged in?`,
              title: $localize`Session Timeout`
            }
          })
          .afterClosed()
          .subscribe((isRenew: boolean) => {
            if (isRenew) {
              this.sessionService.closeWarningAndRenewSession();
            } else {
              this.logOut();
            }
          });
      })
    );

    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(({ previousNode }) => {
        let currentNode = this.studentDataService.getCurrentNode();
        let currentNodeId = currentNode.id;

        this.studentDataService.updateStackHistory(currentNodeId);
        this.studentDataService.updateVisitedNodesHistory(currentNodeId);

        let componentId, componentType, category, eventName, eventData, eventNodeId;
        if (previousNode != null && this.projectService.isGroupNode(previousNode.id)) {
          // going from group to node or group to group
          componentId = null;
          componentType = null;
          category = 'Navigation';
          eventName = 'nodeExited';
          eventData = {
            nodeId: previousNode.id
          };
          eventNodeId = previousNode.id;
          this.studentDataService.saveVLEEvent(
            eventNodeId,
            componentId,
            componentType,
            category,
            eventName,
            eventData
          );
        }

        if (this.projectService.isGroupNode(currentNodeId)) {
          componentId = null;
          componentType = null;
          category = 'Navigation';
          eventName = 'nodeEntered';
          eventData = {
            nodeId: currentNode.id
          };
          eventNodeId = currentNode.id;
          this.studentDataService.saveVLEEvent(
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

    this.processNotifications();
    this.subscriptions.add(
      this.notificationService.notificationChanged$.subscribe(() => {
        this.processNotifications();
      })
    );

    this.subscriptions.add(
      this.studentDataService.pauseScreen$.subscribe((doPause: boolean) => {
        if (doPause) {
          this.pauseScreen();
        } else {
          this.unPauseScreen();
        }
      })
    );

    this.subscriptions.add(
      this.notebookService.notesVisible$.subscribe((notesVisible: boolean) => {
        this.notesVisible = notesVisible;
        if (this.notesVisible) {
          this.drawer.open();
        } else {
          this.drawer.close();
        }
      })
    );

    this.subscriptions.add(
      this.notebookService.reportFullScreen$.subscribe((full: boolean) => {
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

    this.themePath = this.projectService.getThemePath();
    this.notebookItemPath = this.themePath + '/notebook/notebookItem.html';

    let nodeId = null;
    let stateParams = null;
    let stateParamNodeId = null;

    if (this.upgrade.$injector != null && this.upgrade.$injector.get('$state') != null) {
      stateParams = this.upgrade.$injector.get('$state').params;
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
      nodeId = this.studentDataService.getLatestNodeEnteredEventNodeIdWithExistingNode();
    }

    if (nodeId == null || nodeId === '') {
      nodeId = this.projectService.getStartNodeId();
    }

    this.studentDataService.setCurrentNodeByNodeId(nodeId);

    const runStatus = this.studentDataService.getRunStatus();
    if (runStatus != null) {
      let pause = false;
      const periodId = this.configService.getPeriodId();
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

    // TODO: set these variables dynamically from theme settings
    this.layoutView = 'list'; // 'list' or 'card'
    this.numberProject = true;

    this.themePath = this.projectService.getThemePath();
    this.themeSettings = this.projectService.getThemeSettings();

    this.nodeStatuses = this.studentDataService.nodeStatuses;
    this.idToOrder = this.projectService.idToOrder;

    this.workgroupId = this.configService.getWorkgroupId();

    this.rootNode = this.projectService.getProjectRootNode();
    this.rootNodeStatus = this.nodeStatuses[this.rootNode.id];

    this.notebookConfig = this.notebookService.getNotebookConfig();
    this.currentNode = this.studentDataService.getCurrentNode();

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

    this.setLayoutState();

    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(() => {
        this.currentNode = this.studentDataService.getCurrentNode();
        this.setLayoutState();
      })
    );

    this.subscriptions.add(
      this.studentDataService.nodeClickLocked$.subscribe(({ nodeId }) => {
        let message = $localize`Sorry, you cannot view this item yet.`;
        const node = this.projectService.getNodeById(nodeId);
        if (node != null) {
          // get the constraints that affect this node
          const constraints = this.projectService.getConstraintsThatAffectNode(node);
          this.projectService.orderConstraints(constraints);

          if (constraints != null && constraints.length > 0) {
            // get the node title the student is trying to go to
            const nodeTitle = this.projectService.getNodePositionAndTitleByNodeId(nodeId);
            message = $localize`<p>To visit <b>${nodeTitle}</b> you need to:</p><ul>`;
          }

          // loop through all the constraints that affect this node
          for (let c = 0; c < constraints.length; c++) {
            const constraint = constraints[c];

            // check if the constraint has been satisfied
            if (constraint != null && !this.studentDataService.evaluateConstraint(constraint)) {
              // the constraint has not been satisfied and is still active
              // get the message that describes how to disable the constraint
              message += `<li>${this.projectService.getConstraintMessage(nodeId, constraint)}</li>`;
            }
          }
          message += `</ul>`;
        }

        this.dialog.open(DialogWithCloseComponent, {
          data: {
            content: message,
            title: $localize`Item Locked`
          }
        });
      })
    );

    this.subscriptions.add(
      this.notificationService.serverConnectionStatus$.subscribe((isConnected) => {
        if (isConnected) {
          this.handleServerReconnect();
        } else {
          this.handleServerDisconnect();
        }
      })
    );

    // handle request for notification dismiss codes
    this.subscriptions.add(
      this.notificationService.viewCurrentAmbientNotification$.subscribe((args) => {
        this.notificationService.displayAmbientNotification(args.notification);
      })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.sessionService.broadcastExit();
  }

  processNotifications(): void {
    this.notifications = this.notificationService.notifications;
    this.newNotifications = this.notificationService.getNewNotifications();
  }

  logOut(eventName = 'logOut') {
    const nodeId = null;
    const componentId = null;
    const componentType = null;
    const category = 'Navigation';
    const event = eventName;
    const eventData = {};
    this.studentDataService
      .saveVLEEvent(nodeId, componentId, componentType, category, event, eventData)
      .then(() => {
        this.sessionService.logOut();
      });
  }

  loadRoot() {
    this.studentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(
      this.projectService.rootNode.id
    );
  }

  mouseMoved() {
    this.sessionService.mouseMoved();
  }

  pauseScreen() {
    this.pauseDialog = this.dialog.open(DialogWithoutCloseComponent, {
      data: {
        content: $localize`Your teacher has paused all the screens in the class.`,
        title: $localize`Screen Paused`
      },
      disableClose: true
    });
  }

  unPauseScreen() {
    this.pauseDialog.close();
    this.pauseDialog = null;
  }

  isPreview() {
    return this.configService.isPreview();
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
       * @param additionalProcessingFunction the function to register for the specified node and
       * component
       */
      registerAdditionalProcessingFunction: (nodeId, componentId, additionalProcessingFunction) => {
        this.projectService.addAdditionalProcessingFunction(
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
        let runId = this.configService.getRunId();
        let periodId = this.configService.getPeriodId();
        let toWorkgroupId = this.configService.getWorkgroupId();

        return this.annotationService.createAutoScoreAnnotation(
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
        let runId = this.configService.getRunId();
        let periodId = this.configService.getPeriodId();
        let toWorkgroupId = this.configService.getWorkgroupId();

        return this.annotationService.createAutoCommentAnnotation(
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
        return this.annotationService.getLatestAnnotation(params);
      },
      /**
       * Updates the annotation locally and on the server
       * @param annotation
       */
      updateAnnotation: (annotation) => {
        this.annotationService.saveAnnotation(annotation);
      },
      /**
       * Returns the maxScore for the specified node and component
       * @param nodeId the node id
       * @param componentId the component id
       * @returns the max score for the component
       */
      getMaxScoreForComponent: (nodeId, componentId) => {
        return this.projectService.getMaxScoreForComponent(nodeId, componentId);
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
        if (this.projectService.isApplicationNode(id)) {
          // currently viewing step, so show step view
          layoutState = 'node';
        } else if (this.projectService.isGroupNode(id)) {
          // currently viewing group node, so show navigation view
          layoutState = 'nav';
        }
      }
    }

    if (this.upgrade.$injector != null) {
      const $state = this.upgrade.$injector.get('$state');
      if (layoutState === 'notebook') {
        $state.go('root.notebook', { nodeId: this.currentNode.id });
      } else {
        this.notebookNavOpen = false;
        if (this.configService.isPreview()) {
          $state.go('root.preview.node', {
            projectId: this.configService.getProjectId(),
            nodeId: this.currentNode.id
          });
        } else {
          $state.go('root.run.node', {
            runId: this.configService.getRunId(),
            nodeId: this.currentNode.id
          });
        }
      }
    }

    this.layoutState = layoutState;
  }

  handleServerDisconnect() {
    if (!this.connectionLostShown) {
      this.snackBar.open(
        $localize`Error: Data is not being saved! Check your internet connection.`
      );
      this.connectionLostShown = true;
    }
  }

  handleServerReconnect() {
    this.connectionLostShown = false;
  }

  getAvatarColorForWorkgroupId(workgroupId) {
    return this.configService.getAvatarColorForWorkgroupId(workgroupId);
  }
}
