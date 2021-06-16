import { Directive, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { Subscription } from 'rxjs';
import { GenerateImageDialog } from '../directives/generate-image-dialog/generate-image-dialog';
import { AnnotationService } from '../services/annotationService';
import { ConfigService } from '../services/configService';
import { NodeService } from '../services/nodeService';
import { NotebookService } from '../services/notebookService';
import { StudentAssetService } from '../services/studentAssetService';
import { StudentDataService } from '../services/studentDataService';
import { UtilService } from '../services/utilService';
import { StudentAssetRequest } from '../vle/studentAsset/StudentAssetRequest';
import { ComponentService } from './componentService';
import { ComponentStateRequest } from './ComponentStateRequest';
import { ComponentStateWrapper } from './ComponentStateWrapper';

@Directive()
export abstract class ComponentStudent {
  @Input()
  nodeId: string;

  @Input()
  componentContent: any;

  @Input()
  componentState: any;

  @Input()
  mode: string;

  @Input()
  workgroupId: number;

  attachments: any[] = [];
  componentId: string;
  componentType: string;
  prompt: SafeHtml;
  isSaveButtonVisible: boolean = false;
  isShowAddToNotebookButton: boolean = false;
  isSubmitButtonVisible: boolean = false;
  isSaveOrSubmitButtonVisible: boolean = false;
  isSubmitButtonDisabled: boolean = false;
  isSubmitDirty: boolean = false;
  isSubmit: boolean = false;
  isDirty: boolean = false;
  isDisabled: boolean = false;
  isStudentAttachmentEnabled: boolean = false;
  submitCounter: number = 0;
  latestAnnotations: any;
  parentStudentWorkIds: any[];
  saveMessage = {
    text: '',
    time: null
  };
  showAddToNotebookButton: boolean;
  requestComponentStateSubscription: Subscription;
  annotationSavedToServerSubscription: Subscription;
  nodeSubmitClickedSubscription: Subscription;
  studentWorkSavedToServerSubscription: Subscription;
  subscriptions: Subscription = new Subscription();

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected upgrade: UpgradeModule,
    protected UtilService: UtilService
  ) {}

  ngOnInit(): void {
    this.componentId = this.componentContent.id;
    this.componentType = this.componentContent.type;
    this.isSaveButtonVisible = this.componentContent.showSaveButton;
    this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
    this.isSaveOrSubmitButtonVisible = this.isSaveButtonVisible || this.isSubmitButtonVisible;
    if (!this.isAuthoringComponentPreviewMode()) {
      this.latestAnnotations = this.AnnotationService.getLatestComponentAnnotations(
        this.nodeId,
        this.componentId,
        this.workgroupId
      );
    }
    this.showAddToNotebookButton =
      this.componentContent.showAddToNotebookButton == null
        ? true
        : this.componentContent.showAddToNotebookButton;
    this.isStudentAttachmentEnabled = this.componentContent.isStudentAttachmentEnabled;
    this.isShowAddToNotebookButton = this.isAddToNotebookEnabled();
    this.subscribeToSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  isAuthoringComponentPreviewMode(): boolean {
    return this.mode === 'authoringComponentPreview';
  }

  subscribeToSubscriptions(): void {
    this.subscribeToAnnotationSavedToServer();
    this.subscribeToNodeSubmitClicked();
    this.subscribeToNotebookItemChosen();
    this.subscribeToNotifyConnectedComponents();
    this.subscribeToAttachStudentAsset();
    this.subscribeToStarterStateRequest();
    this.subscribeToStudentWorkSavedToServer();
    this.subscribeToRequestComponentState();
  }

  subscribeToAnnotationSavedToServer() {
    this.subscriptions.add(
      this.AnnotationService.annotationSavedToServer$.subscribe(({ annotation }) => {
        if (this.isForThisComponent(annotation)) {
          this.latestAnnotations = this.AnnotationService.getLatestComponentAnnotations(
            this.nodeId,
            this.componentId,
            this.workgroupId
          );
        }
      })
    );
  }

  subscribeToNodeSubmitClicked() {
    this.subscriptions.add(
      this.NodeService.nodeSubmitClicked$.subscribe(({ nodeId }) => {
        if (this.nodeId === nodeId) {
          this.submit('nodeSubmitButton');
        }
      })
    );
  }

  subscribeToNotifyConnectedComponents(): void {
    this.subscriptions.add(
      this.ComponentService.notifyConnectedComponentSource$.subscribe(
        ({ nodeId, componentId, componentState }) => {
          if (nodeId === this.nodeId && componentId === this.componentId) {
            this.processConnectedComponentState(componentState);
          }
        }
      )
    );
  }

  subscribeToNotebookItemChosen() {
    this.subscriptions.add(
      this.NotebookService.notebookItemChosen$.subscribe(({ requester, notebookItem }) => {
        if (requester === `${this.nodeId}-${this.componentId}`) {
          const studentWorkId = notebookItem.content.studentWorkIds[0];
          this.importWorkByStudentWorkId(studentWorkId);
        }
      })
    );
  }

  importWorkByStudentWorkId(studentWorkId: number): void {
    this.StudentDataService.getStudentWorkById(studentWorkId).then((componentState) => {
      if (componentState != null) {
        this.setStudentWork(componentState);
        this.setParentStudentWorkIdToCurrentStudentWork(studentWorkId);
        this.NotebookService.setNotesVisible(false);
        this.NotebookService.setInsertMode({ insertMode: false });
      }
    });
  }

  setParentStudentWorkIdToCurrentStudentWork(studentWorkId: number): void {
    this.parentStudentWorkIds = [studentWorkId];
  }

  processConnectedComponentState(componentState: any): void {
    // overridden by children
  }

  isForThisComponent(object: any) {
    return this.nodeId === object.nodeId && this.componentId === object.componentId;
  }

  subscribeToAttachStudentAsset() {
    this.subscriptions.add(
      this.StudentAssetService.attachStudentAsset$.subscribe(
        (studentAssetRequest: StudentAssetRequest) => {
          if (this.isForThisComponent(studentAssetRequest)) {
            this.copyAndAttachStudentAsset(studentAssetRequest.asset);
          }
        }
      )
    );
  }

  subscribeToStarterStateRequest() {
    this.subscriptions.add(
      this.NodeService.starterStateRequest$.subscribe((args: any) => {
        if (this.isForThisComponent(args)) {
          this.generateStarterState();
        }
      })
    );
  }

  generateStarterState() {}

  copyAndAttachStudentAsset(studentAsset: any): any {
    this.StudentAssetService.copyAssetForReference(studentAsset).then((copiedAsset: any) => {
      const attachment = {
        studentAssetId: copiedAsset.id,
        iconURL: copiedAsset.iconURL,
        url: copiedAsset.url,
        type: copiedAsset.type
      };
      this.attachments.push(attachment);
      this.attachStudentAsset(copiedAsset);
      this.studentDataChanged();
    });
  }

  attachStudentAsset(studentAsset: any): void {}

  subscribeToStudentWorkSavedToServer(): void {
    this.subscriptions.add(
      this.StudentDataService.studentWorkSavedToServer$.subscribe((componentState: any) => {
        this.handleStudentWorkSavedToServer(componentState);
      })
    );
  }

  handleStudentWorkSavedToServer(componentState: any): void {
    if (this.isForThisComponent(componentState)) {
      this.setIsDirty(false);
      this.emitComponentDirty(this.getIsDirty());
      const clientSaveTime = this.ConfigService.convertToClientTimestamp(
        componentState.serverSaveTime
      );
      if (componentState.isSubmit) {
        this.setSubmittedMessage(clientSaveTime);
        this.lockIfNecessary();
        this.setIsSubmitDirty(false);
        this.StudentDataService.broadcastComponentSubmitDirty({
          componentId: this.componentId,
          isDirty: this.isSubmitDirty
        });
      } else if (componentState.isAutoSave) {
        this.setAutoSavedMessage(clientSaveTime);
      } else {
        this.setSavedMessage(clientSaveTime);
      }
    }
    this.handleStudentWorkSavedToServerAdditionalProcessing(componentState);
  }

  getIsDirty(): boolean {
    return this.isDirty;
  }

  lockIfNecessary(): void {
    if (this.isLockAfterSubmit()) {
      this.isDisabled = true;
    }
  }

  handleStudentWorkSavedToServerAdditionalProcessing(componentState: any): void {}

  subscribeToRequestComponentState(): void {
    this.subscriptions.add(
      this.ComponentService.requestComponentStateSource$.subscribe(
        (request: ComponentStateRequest) => {
          if (this.isForThisComponent(request)) {
            this.ComponentService.sendComponentState(this.getComponentStateWrapper(request));
          }
        }
      )
    );
  }

  getComponentStateWrapper(request: ComponentStateRequest): ComponentStateWrapper {
    return {
      nodeId: this.nodeId,
      componentId: this.componentId,
      componentStatePromise: this.getComponentStatePromise(request)
    };
  }

  getComponentStatePromise(request: ComponentStateRequest): Promise<any> {
    if (this.shouldCreateComponentState(request)) {
      return this.createComponentState(this.getAction(request));
    } else {
      return Promise.resolve(null);
    }
  }

  shouldCreateComponentState(request: ComponentStateRequest): boolean {
    return this.isDirty || request.isSubmit;
  }

  getAction(request: ComponentStateRequest): string {
    return request.isSubmit ? 'submit' : 'save';
  }

  broadcastDoneRenderingComponent(): void {
    this.NodeService.broadcastDoneRenderingComponent({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
  }

  disableComponentIfNecessary(): void {
    if (this.isLockAfterSubmit()) {
      const componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
      if (this.NodeService.isWorkSubmitted(componentStates)) {
        this.isDisabled = true;
      }
    }
  }

  isLockAfterSubmit(): boolean {
    return this.componentContent.lockAfterSubmit;
  }

  handleConnectedComponents(): void {
    const connectedComponents = this.componentContent.connectedComponents;
    if (connectedComponents != null) {
      const componentStates = [];
      for (const connectedComponent of connectedComponents) {
        const componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
          connectedComponent.nodeId,
          connectedComponent.componentId
        );
        if (componentState != null) {
          componentStates.push(this.UtilService.makeCopyOfJSONObject(componentState));
        }
        if (connectedComponent.type === 'showWork') {
          this.isDisabled = true;
        }
      }
      if (componentStates.length > 0) {
        this.setStudentWork(this.createMergedComponentState(componentStates));
        this.handleConnectedComponentsPostProcess();
        this.studentDataChanged();
      }
    }
  }

  createMergedComponentState(componentStates: any[]): any {
    return componentStates[0];
  }

  setStudentWork(componentState: any): void {
    // overridden by children
  }

  handleConnectedComponentsPostProcess(): void {
    // overridden by children
  }

  incrementSubmitCounter(): void {
    this.submitCounter++;
  }

  saveButtonClicked(): void {
    this.isSubmit = false;
    this.StudentDataService.broadcastComponentSaveTriggered({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
    if (this.isAuthoringComponentPreviewMode()) {
      this.saveForAuthoringPreviewMode('save');
    }
  }

  saveForAuthoringPreviewMode(action: string): void {
    this.createComponentState(action).then((componentState: any) => {
      this.StudentDataService.setDummyIdIntoLocalId(componentState);
      this.StudentDataService.setDummyServerSaveTimeIntoLocalServerSaveTime(componentState);
      this.handleStudentWorkSavedToServer({ studentWork: componentState });
    });
  }

  submitButtonClicked(): void {
    this.submit('componentSubmitButton');
  }

  submit(submitTriggeredBy = null): void {
    if (this.isSubmitDirty) {
      let isPerformSubmit = true;
      if (this.hasMaxSubmitCount()) {
        const numberOfSubmitsLeft = this.getNumberOfSubmitsLeft();
        if (this.hasSubmitMessage()) {
          isPerformSubmit = this.confirmSubmit(numberOfSubmitsLeft);
        } else {
          if (numberOfSubmitsLeft <= 0) {
            isPerformSubmit = false;
          }
        }
      }
      if (isPerformSubmit) {
        this.performSubmit(submitTriggeredBy);
      } else {
        this.setIsSubmit(false);
      }
    }
  }

  hasMaxSubmitCount(): boolean {
    return this.getMaxSubmitCount() != null;
  }

  hasUsedAllSubmits(): boolean {
    return this.getNumberOfSubmitsLeft() <= 0;
  }

  hasMaxSubmitCountAndUsedAllSubmits() {
    return this.hasMaxSubmitCount() && this.hasUsedAllSubmits();
  }

  getNumberOfSubmitsLeft(): number {
    return this.getMaxSubmitCount() - this.submitCounter;
  }

  getMaxSubmitCount(): number {
    return this.componentContent.maxSubmitCount;
  }

  setIsSubmit(isSubmit: boolean): void {
    this.isSubmit = isSubmit;
  }

  confirmSubmit(numberOfSubmitsLeft: number): boolean {
    return true;
  }

  performSubmit(submitTriggeredBy: string): void {
    this.setIsSubmit(true);
    this.incrementSubmitCounter();

    if (!this.canSubmit()) {
      this.disableSubmitButton();
    }

    if (submitTriggeredBy == null || submitTriggeredBy === 'componentSubmitButton') {
      this.emitComponentSubmitTriggered();
      if (this.isAuthoringComponentPreviewMode()) {
        this.saveForAuthoringPreviewMode('submit');
      }
    }
  }

  canSubmit(): boolean {
    return !this.hasMaxSubmitCount() || this.hasSubmitsLeft();
  }

  disableAllInput(): void {
    this.isDisabled = true;
  }

  disableSubmitButton(): void {
    this.isSubmitButtonDisabled = true;
  }

  hasSubmitsLeft(): boolean {
    return this.getNumberOfSubmitsLeft() > 0;
  }

  hasSubmitMessage(): boolean {
    return false;
  }

  setIsSubmitDirty(isDirty: boolean): void {
    this.isSubmitDirty = isDirty;
  }

  emitComponentSubmitTriggered(): void {
    this.StudentDataService.broadcastComponentSubmitTriggered({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
  }

  studentDataChanged(): void {
    this.setIsDirtyAndBroadcast();
    this.setIsSubmitDirtyAndBroadcast();
    this.clearSaveText();
    const action = 'change';
    this.createComponentStateAndBroadcast(action);
  }

  setIsDirtyAndBroadcast(): void {
    this.setIsDirty(true);
    this.emitComponentDirty(true);
  }

  setIsSubmitDirtyAndBroadcast(): void {
    this.setIsSubmitDirty(true);
    this.emitComponentSubmitDirty(true);
  }

  setIsDirty(isDirty: boolean): void {
    this.isDirty = isDirty;
  }

  emitComponentDirty(isDirty: boolean): void {
    this.StudentDataService.broadcastComponentDirty({
      componentId: this.componentId,
      isDirty: isDirty
    });
  }

  emitComponentSubmitDirty(isDirty: boolean): void {
    this.StudentDataService.broadcastComponentSubmitDirty({
      componentId: this.componentId,
      isDirty: isDirty
    });
  }

  clearSaveText(): void {
    this.setSaveText('', null);
  }

  setSaveText(message: string, time: number): void {
    this.saveMessage.text = message;
    this.saveMessage.time = time;
  }

  setSavedMessage(time: number): void {
    this.setSaveText($localize`Saved`, time);
  }

  setAutoSavedMessage(time: number): void {
    this.setSaveText($localize`Auto Saved`, time);
  }

  setSubmittedMessage(time: number): void {
    this.setSaveText($localize`Submitted`, time);
  }

  createComponentStateAndBroadcast(action: string): void {
    this.createComponentState(action).then((componentState: any) => {
      this.emitComponentStudentDataChanged(componentState);
    });
  }

  createComponentState(action: string): Promise<any> {
    return Promise.resolve({});
  }

  emitComponentStudentDataChanged(componentState: any): void {
    this.StudentDataService.broadcastComponentStudentData({
      nodeId: this.nodeId,
      componentId: this.componentId,
      componentState: componentState
    });
  }

  processLatestStudentWork(): void {
    const latestComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    if (latestComponentState) {
      const clientSaveTime = this.ConfigService.convertToClientTimestamp(
        latestComponentState.serverSaveTime
      );
      if (latestComponentState.isSubmit) {
        this.setIsSubmitDirty(false);
        this.emitComponentSubmitDirty(false);
        this.setSubmittedMessage(clientSaveTime);
      } else {
        this.setIsSubmitDirty(true);
        this.emitComponentSubmitDirty(true);
        this.setSavedMessage(clientSaveTime);
      }
    }
  }

  createComponentStateAdditionalProcessing(
    promise: any,
    componentState: any,
    action: string
  ): void {
    /*
     * we don't need to perform any additional processing so we can resolve
     * the promise immediately
     */
    promise.resolve(componentState);
  }

  /**
   * Render the component state and then generate an image from it.
   * @param componentState The component state to render.
   * @return A promise that will return an image.
   */
  generateImageFromComponentState(componentState: any): any {
    return this.upgrade.$injector
      .get('$mdDialog')
      .show({
        templateUrl: 'assets/wise5/directives/generate-image-dialog/generate-image-dialog.html',
        controller: GenerateImageDialog,
        controllerAs: '$ctrl',
        locals: {
          componentState: componentState
        }
      })
      .then((image: any) => {
        return image;
      });
  }

  isAddToNotebookEnabled() {
    return (
      this.isNotebookEnabled() &&
      this.isStudentNoteClippingEnabled() &&
      this.showAddToNotebookButton
    );
  }

  copyPublicNotebookItem() {
    this.NotebookService.setInsertMode({
      nodeId: this.nodeId,
      componentId: this.componentId,
      insertMode: true,
      requester: this.nodeId + '-' + this.componentId,
      visibleSpace: 'public'
    });
    this.NotebookService.setNotesVisible(true);
  }

  isNotebookEnabled() {
    return this.NotebookService.isNotebookEnabled();
  }

  isStudentNoteClippingEnabled() {
    return this.NotebookService.isStudentNoteClippingEnabled();
  }

  showStudentAssets() {
    this.StudentAssetService.broadcastShowStudentAssets({
      nodeId: this.nodeId,
      componentId: this.componentId
    });
  }

  importWorkAsBackground(componentState: any): void {
    const connectedComponent = this.UtilService.getConnectedComponentByComponentState(
      this.componentContent,
      componentState
    );
    if (connectedComponent.importWorkAsBackground) {
      this.setComponentStateAsBackgroundImage(componentState);
    }
  }

  setComponentStateAsBackgroundImage(componentState: any): void {
    this.generateImageFromComponentState(componentState).then((image: any) => {
      this.setBackgroundImage(image.url);
    });
  }

  setBackgroundImage(image: string): void {}

  hasMaxScore(): boolean {
    return this.componentContent.maxScore != null && this.componentContent.maxScore !== '';
  }

  getMaxScore(): number {
    return this.componentContent.maxScore;
  }

  getClientSaveTime(componentState: any): number {
    return this.ConfigService.convertToClientTimestamp(componentState.serverSaveTime);
  }

  addDefaultFeedback(componentState: any): void {
    const defaultFeedback = this.getDefaultFeedback(this.submitCounter);
    if (defaultFeedback != null) {
      componentState.annotations = [this.createDefaultFeedbackAnnotation(defaultFeedback)];
    }
  }

  hasDefaultFeedback(): boolean {
    return (
      this.componentContent.defaultFeedback != null &&
      this.componentContent.defaultFeedback.length > 0
    );
  }

  getDefaultFeedback(submitCount: number): string {
    return this.componentContent.defaultFeedback[submitCount - 1];
  }

  createDefaultFeedbackAnnotation(feedbackText: string): any {
    const defaultFeedbackAnnotationData: any = {
      autoGrader: 'defaultFeedback',
      value: feedbackText
    };
    return this.createAutoCommentAnnotation(defaultFeedbackAnnotationData);
  }

  createAutoCommentAnnotation(data: any): any {
    return this.AnnotationService.createAutoCommentAnnotation(
      this.ConfigService.getRunId(),
      this.ConfigService.getPeriodId(),
      this.nodeId,
      this.componentId,
      this.ConfigService.getWorkgroupId(),
      data
    );
  }
}
