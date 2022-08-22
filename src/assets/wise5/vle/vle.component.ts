import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ConfigService } from '../services/configService';
import { InitializeVLEService } from '../services/initializeVLEService';
import { NotebookService } from '../services/notebookService';
import { NotificationService } from '../services/notificationService';
import { SessionService } from '../services/sessionService';
import { StudentDataService } from '../services/studentDataService';
import { VLEProjectService } from './vleProjectService';
import { DialogWithConfirmComponent } from '../directives/dialog-with-confirm/dialog-with-confirm.component';
import { AnnotationService } from '../services/annotationService';
import { UtilService } from '../services/utilService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vle',
  templateUrl: './vle.component.html',
  styleUrls: ['./vle.component.scss']
})
export class VLEComponent implements OnInit {
  connectionLostShown: boolean = false;
  currentNode: any;
  @ViewChild('drawer') public drawer: any;
  isInitialized: boolean;
  layoutState: string;
  notebookConfig: any;
  notesEnabled: boolean = false;
  notesVisible: boolean = false;
  numberProject: boolean;
  projectStyle: string;
  reportEnabled: boolean = false;
  reportFullscreen: boolean = false;
  runEndedAndLocked: boolean;
  subscriptions: Subscription = new Subscription();

  constructor(
    private annotationService: AnnotationService,
    private configService: ConfigService,
    private dialog: MatDialog,
    private initializeVLEService: InitializeVLEService,
    private notebookService: NotebookService,
    private notificationService: NotificationService,
    private projectService: VLEProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private snackBar: MatSnackBar,
    private studentDataService: StudentDataService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.initializeVLEService.initialized$.subscribe((initialized: boolean) => {
      if (initialized) {
        this.initRestOfVLE();
        this.isInitialized = true;
      }
    });
  }

  initRestOfVLE() {
    this.projectStyle = this.projectService.getStyle();
    if (this.notebookService.isNotebookEnabled()) {
      this.notebookConfig = this.notebookService.getStudentNotebookConfig();
      this.notesEnabled = this.notebookConfig.itemTypes.note.enabled;
      this.reportEnabled = this.notebookConfig.itemTypes.report.enabled;
    }

    this.runEndedAndLocked = this.configService.isEndedAndLocked();
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

    // TODO: set these variables dynamically from theme settings
    this.numberProject = true;
    this.notebookConfig = this.notebookService.getNotebookConfig();
    this.currentNode = this.studentDataService.getCurrentNode();
    this.setLayoutState();
    this.initializeSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.sessionService.broadcastExit();
  }

  @HostListener('window:snip-image', ['$event.detail.target'])
  snipImage(image: Element): void {
    this.notebookService.addNote(
      this.studentDataService.getCurrentNodeId(),
      this.utilService.getImageObjectFromImageElement(image)
    );
  }

  closeNotes(): void {
    this.notebookService.closeNotes();
  }

  private initializeSubscriptions(): void {
    this.subscribeToShowSessionWarning();
    this.subscribeToCurrentNodeChanged();
    this.subscribeToNotesVisible();
    this.subscribeToReportFullScreen();
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
        this.router.navigate([currentNodeId], { relativeTo: this.route.parent });
        this.setLayoutState();
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
