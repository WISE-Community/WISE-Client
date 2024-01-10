import * as html2canvas from 'html2canvas';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { EmbeddedService } from '../embeddedService';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { copy } from '../../../common/object/object';
import { convertToPNGFile } from '../../../common/canvas/canvas';

@Component({
  selector: 'embedded-student',
  templateUrl: 'embedded-student.component.html',
  styleUrls: ['embedded-student.component.scss']
})
export class EmbeddedStudent extends ComponentStudent {
  annotationsToSave: any[] = [];
  componentStateId: number;
  componentType: string;
  embeddedApplicationIFrameId: string;
  height: string = '600px';
  maxWidth: number;
  maxHeight: number;
  messageEventListener: any;
  messageTypeToFunctionHandler: any = {
    applicationInitialized: (messageEventData: any) => {
      this.handleApplicationInitializedMessage();
    },
    componentDirty: (messageEventData: any) => {
      this.handleComponentDirtyMessage(messageEventData);
    },
    componentSubmitDirty: (messageEventData: any) => {
      this.handleComponentSubmitDirtyMessage(messageEventData);
    },
    event: (messageEventData: any) => {
      this.handleEventMessage(messageEventData);
    },
    getLatestAnnotations: (messageEventData: any) => {
      this.handleGetLatestAnnotationsMessage();
    },
    getLatestStudentWork: (messageEventData: any) => {
      this.handleGetLatestStudentWorkMessage();
    },
    getParameters: (messageEventData: any) => {
      this.handleGetParametersMessage();
    },
    getProjectPath: (messageEventData: any) => {
      this.handleGetProjectPathMessage();
    },
    getStudentWork: (messageEventData: any) => {
      this.handleGetStudentWorkMessage(messageEventData);
    },
    studentDataChanged: (messageEventData: any) => {
      this.handleStudentDataChangedMessage(messageEventData);
    },
    studentWork: (messageEventData: any) => {
      this.handleStudentWorkMessage(messageEventData);
    }
  };
  notebookConfig: any;
  studentData: any;
  url: SafeUrl;
  width: string = '100%';

  constructor(
    protected AnnotationService: AnnotationService,
    private changeDetectorRef: ChangeDetectorRef,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    private EmbeddedService: EmbeddedService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private saniztizer: DomSanitizer,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      dialog,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setWidthAndHeight(this.componentContent.width, this.componentContent.height);
    this.notebookConfig = this.NotebookService.getNotebookConfig();
    this.embeddedApplicationIFrameId = this.EmbeddedService.getEmbeddedApplicationIframeId(
      this.componentId
    );
    this.componentType = this.componentContent.type;
    this.setURL(this.componentContent.url);
    this.initializeMessageEventListener();
    this.broadcastDoneRenderingComponent();
    if (this.componentState != null) {
      this.setSubmitCounter(this.componentState);
    }
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.disableSubmitButton();
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    window.removeEventListener('message', this.messageEventListener);
  }

  setWidthAndHeight(width: number, height: number): void {
    if (width != null) {
      this.width = `${width}px`;
    }
    if (height != null) {
      this.height = `${height}px`;
    }
  }

  initializeMessageEventListener(): void {
    this.messageEventListener = (messageEvent: any) => {
      const messageEventData = messageEvent.data;
      const messageType = messageEventData.messageType;
      if (this.messageTypeToFunctionHandler[messageType] != null) {
        this.messageTypeToFunctionHandler[messageType](messageEventData);
      }
    };
  }

  handleEventMessage(messageEventData: any): void {
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const componentType = this.componentType;
    const category = messageEventData.eventCategory;
    const event = messageEventData.event;
    const eventData = messageEventData.eventData;
    this.StudentDataService.saveVLEEvent(
      nodeId,
      componentId,
      componentType,
      category,
      event,
      eventData
    );
  }

  handleStudentWorkMessage(messageEventData: any): void {
    if (messageEventData.id != null) {
      //the model wants to update/overwrite an existing component state
      this.componentStateId = messageEventData.id;
    } else {
      // the model wants to create a new component state
      this.componentStateId = null;
    }

    if (messageEventData.isSubmit) {
      this.isSubmit = messageEventData.isSubmit;
    }

    this.isDirty = true;
    this.setStudentData(messageEventData.studentData);
    if (messageEventData.annotations != null) {
      this.setAnnotations(messageEventData.annotations);
    }

    // tell the parent node that this component wants to save
    this.StudentDataService.broadcastComponentSaveTriggered({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
  }

  handleApplicationInitializedMessage(): void {
    this.sendLatestWorkToApplication();
    this.processLatestStudentWork();
  }

  handleComponentDirtyMessage(messageEventData: any): void {
    this.isDirty = messageEventData.isDirty;
    this.emitComponentDirty(this.isDirty);
  }

  handleComponentSubmitDirtyMessage(messageEventData: any): void {
    this.isSubmitDirty = messageEventData.isDirty;
    this.emitComponentSubmitDirty(this.isSubmitDirty);
  }

  handleStudentDataChangedMessage(messageEventData: any): void {
    this.setStudentData(messageEventData.studentData);
    if (messageEventData.annotations != null) {
      this.setAnnotations(messageEventData.annotations);
    }
    this.studentDataChanged();
  }

  handleGetStudentWorkMessage(messageEventData: any): void {
    const getStudentWorkParams = messageEventData.getStudentWorkParams;
    const studentWork = this.getStudentWork(messageEventData.getStudentWorkParams);
    const message: any = studentWork;
    message.messageType = 'studentWork';
    message.getStudentWorkParams = getStudentWorkParams;
    this.sendMessageToApplication(message);
  }

  handleGetLatestStudentWorkMessage(): void {
    this.sendMessageToApplication(
      this.EmbeddedService.createLatestStudentWorkMessage(this.getLatestStudentWork())
    );
  }

  handleGetParametersMessage(): void {
    this.EmbeddedService.handleGetParametersMessage(
      this.embeddedApplicationIFrameId,
      this.nodeId,
      this.componentId,
      this.componentContent
    );
  }

  handleGetProjectPathMessage(): void {
    this.sendMessageToApplication(this.EmbeddedService.createProjectPathMessage());
  }

  handleGetLatestAnnotationsMessage(): void {
    const workgroupId = this.ConfigService.getWorkgroupId();
    const type = 'any';
    const latestScoreAnnotation = this.AnnotationService.getLatestScoreAnnotation(
      this.nodeId,
      this.componentId,
      workgroupId,
      type
    );
    const latestCommentAnnotation = this.AnnotationService.getLatestCommentAnnotation(
      this.nodeId,
      this.componentId,
      workgroupId,
      type
    );
    const message = {
      messageType: 'latestAnnotations',
      latestScoreAnnotation: latestScoreAnnotation,
      latestCommentAnnotation: latestCommentAnnotation
    };
    this.sendMessageToApplication(message);
  }

  handleStudentWorkSavedToServerAdditionalProcessing(componentState: any): void {
    const message = {
      messageType: 'componentStateSaved',
      componentState: componentState
    };
    this.sendMessageToApplication(message);
  }

  iframeLoaded(): void {
    if (this.embeddedApplicationIFrameId != null) {
      (window.document.getElementById(
        this.embeddedApplicationIFrameId
      ) as HTMLIFrameElement).contentWindow.addEventListener('message', this.messageEventListener);
    }
  }

  setURL(url: string): void {
    this.url = this.saniztizer.bypassSecurityTrustResourceUrl(url);
  }

  createComponentState(action: string): Promise<any> {
    const componentState = this.createComponentStateObject();
    if (action === 'save') {
      this.clearAnnotationsToSave();
    }
    return new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
  }

  createComponentStateObject(): any {
    const componentState: any = this.createNewComponentState();
    componentState.studentData = this.studentData;
    componentState.componentType = 'Embedded';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    if (this.componentStateId != null) {
      componentState.id = this.componentStateId;
    }
    if (this.isSubmit) {
      componentState.isSubmit = this.isSubmit;
      this.isSubmit = false;
      if (this.hasDefaultFeedback()) {
        this.addDefaultFeedback(componentState);
      }
    }
    if (this.annotationsToSave.length !== 0) {
      componentState.annotations = this.annotationsToSave;
    }
    return componentState;
  }

  clearAnnotationsToSave(): void {
    this.annotationsToSave = [];
  }

  sendLatestWorkToApplication(): void {
    let componentState = this.componentState;
    if (this.component.hasConnectedComponent()) {
      componentState = this.handleConnectedComponents();
    }
    const message = {
      messageType: 'componentState',
      componentState: componentState
    };
    this.sendMessageToApplication(message);
  }

  sendMessageToApplication(message: any): void {
    this.EmbeddedService.sendMessageToApplication(this.embeddedApplicationIFrameId, message);
  }

  /**
   * Snip the model by converting it to an image
   * @param $event the click event
   */
  snipModel($event): void {
    const iframe = $('#' + this.embeddedApplicationIFrameId);
    if (iframe != null && iframe.length > 0) {
      let modelElement: any = iframe.contents().find('html');
      if (modelElement != null && modelElement.length > 0) {
        modelElement = modelElement[0];
        html2canvas(modelElement).then((canvas) => {
          const pngFile = convertToPNGFile(canvas);
          this.NotebookService.addNote(this.StudentDataService.getCurrentNodeId(), pngFile);
        });
      }
    }
  }

  getLatestStudentWork(): any {
    return this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
  }

  /**
   * Get the student work from the specified components/nodes
   * @param params The params for getting the student work. The possible values to request are
   * getLatestStudentWorkFromThisComponent
   * getAllStudentWorkFromThisComponent
   * getLatestStudentWorkFromThisNode
   * getAllStudentWorkFromThisNode
   * getLatestStudentWorkFromOtherComponents
   * getAllStudentWorkFromOtherComponents
   * If getLatestStudentWorkFromOtherComponents or getAllStudentWorkFromOtherComponents are
   * requested, the otherComponents param must be provided. otherComponents should be an array of
   * objects. The objects should contain a nodeId and componentId.
   * @return object containing other objects that contain work from the specified components/nodes
   */
  getStudentWork(params: any): any {
    const studentWork: any = {};
    this.tryGetLatestStudentWorkFromThisComponent(params, studentWork);
    this.tryGetAllStudentWorkFromThisComponent(params, studentWork);
    this.tryGetLatestStudentWorkFromThisNode(params, studentWork);
    this.tryGetAllStudentWorkFromThisNode(params, studentWork);
    this.tryGetLatestStudentWorkFromOtherComponents(params, studentWork);
    this.tryGetAllStudentWorkFromOtherComponents(params, studentWork);
    return studentWork;
  }

  tryGetLatestStudentWorkFromThisComponent(params: any, studentWork: any): void {
    if (params.getLatestStudentWorkFromThisComponent) {
      studentWork.latestStudentWorkFromThisComponent = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
    }
  }

  tryGetAllStudentWorkFromThisComponent(params: any, studentWork: any): void {
    if (params.getAllStudentWorkFromThisComponent) {
      studentWork.allStudentWorkFromThisComponent = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
    }
  }

  tryGetLatestStudentWorkFromThisNode(params: any, studentWork: any): void {
    if (params.getLatestStudentWorkFromThisNode) {
      studentWork.latestStudentWorkFromThisNode = this.StudentDataService.getLatestComponentStatesByNodeId(
        this.nodeId
      );
    }
  }

  tryGetAllStudentWorkFromThisNode(params: any, studentWork: any): void {
    if (params.getAllStudentWorkFromThisNode) {
      studentWork.allStudentWorkFromThisNode = this.StudentDataService.getComponentStatesByNodeId(
        this.nodeId
      );
    }
  }

  tryGetLatestStudentWorkFromOtherComponents(params: any, studentWork: any): void {
    if (params.getLatestStudentWorkFromOtherComponents) {
      studentWork.latestStudentWorkFromOtherComponents = this.getLatestStudentWorkFromOtherComponents(
        params.otherComponents
      );
    }
  }

  tryGetAllStudentWorkFromOtherComponents(params: any, studentWork: any): void {
    if (params.getAllStudentWorkFromOtherComponents) {
      studentWork.allStudentWorkFromOtherComponents = this.getAllStudentWorkFromOtherComponents(
        params.otherComponents
      );
    }
  }

  getLatestStudentWorkFromOtherComponents(otherComponents: any[]): any {
    const latestStudentWorkFromOtherComponents = [];
    for (const otherComponent of otherComponents) {
      const tempComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
        otherComponent.nodeId,
        otherComponent.componentId
      );
      if (tempComponentState != null) {
        latestStudentWorkFromOtherComponents.push(tempComponentState);
      }
    }
    return latestStudentWorkFromOtherComponents;
  }

  getAllStudentWorkFromOtherComponents(otherComponents: any[]): any {
    const allStudentWorkFromOtherComponents = [];
    for (const otherComponent of otherComponents) {
      const tempComponentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
        otherComponent.nodeId,
        otherComponent.componentId
      );
      if (tempComponentStates != null && tempComponentStates.length > 0) {
        allStudentWorkFromOtherComponents.push(...tempComponentStates);
      }
    }
    return allStudentWorkFromOtherComponents;
  }

  /**
   * Import any work we need from connected components
   */
  handleConnectedComponents(): any {
    let mergedComponentState = this.componentState;
    if (this.componentContent.connectedComponents != null) {
      mergedComponentState = this.getConnectedComponentMergedComponentState();
      if (mergedComponentState != null) {
        this.setStudentWork(mergedComponentState);
        this.studentDataChanged();
      }
    }
    return mergedComponentState;
  }

  getConnectedComponentMergedComponentState(): any {
    let mergedComponentState = this.componentState;
    const firstTime = mergedComponentState == null;
    if (mergedComponentState == null) {
      mergedComponentState = this.createNewComponentState();
      mergedComponentState.studentData = {};
    }
    for (const connectedComponent of this.componentContent.connectedComponents) {
      mergedComponentState = this.handleImportWorkConnectedComponent(
        connectedComponent,
        mergedComponentState,
        firstTime
      );
    }
    return mergedComponentState;
  }

  handleShowWorkConnectedComponent(connectedComponent: any, componentStates: any[]): void {
    const nodeId = connectedComponent.nodeId;
    const componentId = connectedComponent.componentId;
    const componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    if (componentState != null) {
      componentStates.push(copy(componentState));
    }
    this.isDisabled = true;
  }

  handleImportWorkConnectedComponent(
    connectedComponent: any,
    mergedComponentState: any,
    firstTime: boolean
  ): any {
    const nodeId = connectedComponent.nodeId;
    const componentId = connectedComponent.componentId;
    const connectedComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      nodeId,
      componentId
    );
    if (connectedComponentState != null) {
      const fields = connectedComponent.fields;
      const when = connectedComponent.when;
      if (when == null || (when === 'firstTime' && firstTime)) {
        mergedComponentState = this.mergeComponentState(
          mergedComponentState,
          connectedComponentState,
          fields,
          firstTime
        );
      }
    }
    return mergedComponentState;
  }

  /**
   * Merge a new component state into a base component state.
   * @param toComponentState The component state we will be merging into.
   * @param fromComponentState The component state we will be merging from.
   * @param mergeFields The fields to merge.
   * @param firstTime Whether this is the first time the baseComponentState is being merged into.
   */
  mergeComponentState(
    toComponentState: any,
    fromComponentState: any,
    mergeFields: any[],
    firstTime: boolean
  ): any {
    if (mergeFields == null) {
      // there are no merge fields specified so we will get all of the fields
      if (fromComponentState.componentType === 'Embedded') {
        toComponentState.studentData = copy(fromComponentState.studentData);
      }
    } else {
      for (const mergeField of mergeFields) {
        this.mergeField(toComponentState, fromComponentState, mergeField, firstTime);
      }
    }
    return toComponentState;
  }

  mergeField(
    toComponentState: any,
    fromComponentState: any,
    mergeField: any,
    firstTime: boolean
  ): void {
    const name = mergeField.name;
    if (this.isPerformOverwrite(mergeField, firstTime)) {
      toComponentState.studentData[name] = fromComponentState.studentData[name];
    }
  }

  isPerformOverwrite(mergeField: any, firstTime: boolean): boolean {
    const when = mergeField.when;
    const action = mergeField.action;
    return (
      action === 'write' && (when === 'always' || (mergeField.when === 'firstTime' && firstTime))
    );
  }

  setStudentWork(componentState: any): void {
    this.studentData = componentState.studentData;
  }

  setStudentData(studentData: any): void {
    this.studentData = studentData;
  }

  setAnnotations(annotations: any[]): void {
    for (const annotation of annotations) {
      if (this.isAnnotationValid(annotation)) {
        if (annotation.type === 'autoScore') {
          const scoreAnnotation = this.createAutoScoreAnnotation(annotation.data);
          this.updateLatestScoreAnnotation(scoreAnnotation);
          this.addToAnnotationsToSave(scoreAnnotation);
        } else if (annotation.type === 'autoComment') {
          const commentAnnotation = this.createAutoCommentAnnotation(annotation.data);
          this.updateLatestCommentAnnotation(commentAnnotation);
          this.addToAnnotationsToSave(commentAnnotation);
        }
      }
    }
  }

  isAnnotationValid(annotation: any): boolean {
    return annotation.type != null && annotation.data != null && annotation.data.value != null;
  }

  addToAnnotationsToSave(annotation: any): void {
    this.annotationsToSave.push(annotation);
  }

  processConnectedComponentState(componentState: any): void {
    const message = {
      messageType: 'handleConnectedComponentStudentDataChanged',
      componentState: componentState
    };
    this.sendMessageToApplication(message);
  }

  connectedComponentStudentDataSaved() {
    if (this.isHandleConnectedComponentAfterConnectedComponentStudentDataSaved()) {
      const message = {
        messageType: 'componentState',
        componentState: this.componentState
      };
      this.sendMessageToApplication(message);
    }
  }

  updateLatestScoreAnnotation(annotation: any): void {
    this.latestAnnotations = {
      comment: this.latestAnnotations.comment,
      score: annotation
    };
    this.changeDetectorRef.detectChanges();
  }

  updateLatestCommentAnnotation(annotation: any): void {
    this.latestAnnotations = {
      comment: annotation,
      score: this.latestAnnotations.score
    };
    this.changeDetectorRef.detectChanges();
  }
}
