import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
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
import { AnnotationService } from '../services/annotationService';

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
  notebookConfig: any;
  notebookFilter: string = '';
  notebookItemPath: string;
  notebookNavOpen: boolean;
  notebookOpen: boolean = false;
  noteDialog: any;
  notesEnabled: boolean = false;
  notesVisible: boolean = false;
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
  ) {}

  ngOnInit(): void {
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

    const stateParams = this.upgrade.$injector.get('$state').params;
    const stateParamNodeId = stateParams.nodeId;

    let nodeId = null;
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

    if (this.shouldScreenBePaused()) {
      this.pauseScreen();
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
    this.initializeSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.sessionService.broadcastExit();
  }

  closeNotes(): void {
    this.notebookService.closeNotes();
  }

  private initializeSubscriptions(): void {
    this.subscribeToShowSessionWarning();
    this.subscribeToCurrentNodeChanged();
    this.subscribeToPauseScreen();
    this.subscribeToNotesVisible();
    this.subscribeToReportFullScreen();
    this.subscribeToNodeClickLocked();
    this.subscribeToServerConnectionStatus();
    this.subscribeToViewCurrentAmbientNotification();
  }

  private subscribeToShowSessionWarning(): void {
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
  }

  private subscribeToCurrentNodeChanged(): void {
    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(({ previousNode }) => {
        this.currentNode = this.studentDataService.getCurrentNode();
        let currentNodeId = this.currentNode.id;

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
            nodeId: currentNodeId
          };
          eventNodeId = currentNodeId;
          this.studentDataService.saveVLEEvent(
            eventNodeId,
            componentId,
            componentType,
            category,
            eventName,
            eventData
          );
        }

        this.setLayoutState();
      })
    );
  }

  private subscribeToPauseScreen(): void {
    this.subscriptions.add(
      this.studentDataService.pauseScreen$.subscribe((doPause: boolean) => {
        if (doPause) {
          this.pauseScreen();
        } else {
          this.unPauseScreen();
        }
      })
    );
  }

  private subscribeToNotesVisible(): void {
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
  }

  private subscribeToReportFullScreen(): void {
    this.subscriptions.add(
      this.notebookService.reportFullScreen$.subscribe((full: boolean) => {
        this.reportFullscreen = full;
      })
    );
  }

  private subscribeToNodeClickLocked(): void {
    this.subscriptions.add(
      this.studentDataService.nodeClickLocked$.subscribe(({ nodeId }) => {
        let message = $localize`Sorry, you cannot view this item yet.`;
        const node = this.projectService.getNodeById(nodeId);
        if (node != null) {
          const constraints = this.projectService.getConstraintsThatAffectNode(node);
          this.projectService.orderConstraints(constraints);
          if (constraints != null && constraints.length > 0) {
            const nodeTitle = this.projectService.getNodePositionAndTitleByNodeId(nodeId);
            message = $localize`<p>To visit <b>${nodeTitle}</b> you need to:</p><ul>`;
          }
          for (let c = 0; c < constraints.length; c++) {
            const constraint = constraints[c];
            if (constraint != null && !this.studentDataService.evaluateConstraint(constraint)) {
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
  }

  private subscribeToServerConnectionStatus(): void {
    this.subscriptions.add(
      this.notificationService.serverConnectionStatus$.subscribe((isConnected) => {
        if (isConnected) {
          this.handleServerReconnect();
        } else {
          this.handleServerDisconnect();
        }
      })
    );
  }

  private subscribeToViewCurrentAmbientNotification(): void {
    this.subscriptions.add(
      this.notificationService.viewCurrentAmbientNotification$.subscribe((args) => {
        this.notificationService.displayAmbientNotification(args.notification);
      })
    );
  }

  private shouldScreenBePaused(): boolean {
    const runStatus = this.studentDataService.getRunStatus();
    const periodId = this.configService.getPeriodId();
    return runStatus.periods.some((period: any) => period.periodId === periodId && period.paused);
  }

  private logOut(eventName = 'logOut') {
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

  private pauseScreen() {
    this.dialog.open(DialogWithoutCloseComponent, {
      data: {
        content: $localize`Your teacher has paused all the screens in the class.`,
        title: $localize`Screen Paused`
      },
      disableClose: true
    });
  }

  private unPauseScreen() {
    this.dialog.closeAll();
  }

  /**
   * Set the layout state of the vle
   * @param state string specifying state (e.g. 'notebook'; optional)
   */
  private setLayoutState(state: string = null) {
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

  private handleServerDisconnect() {
    if (!this.connectionLostShown) {
      this.snackBar.open(
        $localize`Error: Data is not being saved! Check your internet connection.`
      );
      this.connectionLostShown = true;
    }
  }

  private handleServerReconnect() {
    this.connectionLostShown = false;
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
}
