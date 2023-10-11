import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ComponentState } from '../../../app/domain/componentState';
import { Component } from '../common/Component';
import { copy } from '../common/object/object';
import { GenerateImageDialogComponent } from '../directives/generate-image-dialog/generate-image-dialog.component';
import { AnnotationService } from '../services/annotationService';
import { ConfigService } from '../services/configService';
import { NodeService } from '../services/nodeService';
import { NotebookService } from '../services/notebookService';
import { StudentAssetService } from '../services/studentAssetService';
import { StudentDataService } from '../services/studentDataService';
import { StudentAssetsDialogComponent } from '../vle/studentAsset/student-assets-dialog/student-assets-dialog.component';
import { StudentAssetRequest } from '../vle/studentAsset/StudentAssetRequest';
import { ComponentService } from './componentService';
import { ComponentStateRequest } from './ComponentStateRequest';
import { ComponentStateWrapper } from './ComponentStateWrapper';
import { Annotation } from '../common/Annotation';

@Directive()
export abstract class ComponentStudent {
  @Input() component: Component;
  @Input() componentState: any;
  @Input() isDisabled: boolean = false;
  @Input() mode: string;
  @Input() nodeId: string;
  @Input() workgroupId: number;
  @Output() saveComponentStateEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() starterStateChangedEvent = new EventEmitter<any>();

  attachments: any[] = [];
  componentContent: any;
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
  isStudentAttachmentEnabled: boolean = false;
  submitCounter: number = 0;
  latestAnnotations: any;
  parentStudentWorkIds: any[];
  latestComponentState: any;
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
    protected dialog: MatDialog,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.nodeId = this.component.nodeId;
    this.componentContent = this.component.content;
    this.componentId = this.componentContent.id;
    this.componentType = this.componentContent.type;
    this.isSaveButtonVisible = this.componentContent.showSaveButton;
    this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
    this.isSaveOrSubmitButtonVisible = this.isSaveButtonVisible || this.isSubmitButtonVisible;
    if (!this.isPreviewMode()) {
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
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.isDisabled = true;
      this.isSubmitButtonDisabled = true;
    }
    this.subscribeToSubscriptions();
  }

  ngOnDestroy(): void {
    if (this.isDirty) {
      const request = {
        componentId: this.componentId,
        isSubmit: false,
        nodeId: this.nodeId
      };
      this.saveComponentStateEvent.emit(this.getComponentStateWrapper(request));
    }
    this.subscriptions.unsubscribe();
  }

  isPreviewMode(): boolean {
    return this.mode === 'preview';
  }

  subscribeToSubscriptions(): void {
    this.subscribeToAnnotationSavedToServer();
    this.subscribeToNodeSubmitClicked();
    this.subscribeToNotebookItemChosen();
    this.subscribeToNotifyConnectedComponents();
    this.subscribeToAttachStudentAsset();
    this.subscribeToStudentWorkSavedToServer();
    this.subscribeToRequestComponentState();
  }

  private subscribeToAnnotationSavedToServer(): void {
    this.subscriptions.add(
      this.AnnotationService.annotationSavedToServer$.subscribe((annotation: Annotation) => {
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
        this.NotebookService.closeNotes();
      }
    });
  }

  setParentStudentWorkIdToCurrentStudentWork(studentWorkId: number): void {
    this.parentStudentWorkIds = [studentWorkId];
  }

  processConnectedComponentState(componentState: any): void {
    // overridden by children
  }

  protected isSameComponent(component: Component): boolean {
    return component.nodeId === this.nodeId && component.content.id === this.componentId;
  }

  isForThisComponent(object: any): boolean {
    return this.nodeId === object.nodeId && this.componentId === object.componentId;
  }

  isWorkFromClassmate(componentState: any): boolean {
    return componentState.workgroupId !== this.ConfigService.getWorkgroupId();
  }

  protected subscribeToAttachStudentAsset(): void {
    this.subscriptions.add(
      this.StudentAssetService.attachStudentAsset$.subscribe(
        (studentAssetRequest: StudentAssetRequest) => {
          if (this.isSameComponent(studentAssetRequest.component)) {
            this.doAttachStudentAsset(studentAssetRequest);
          }
        }
      )
    );
  }

  protected doAttachStudentAsset(studentAssetRequest: StudentAssetRequest): void {
    this.copyAndAttachStudentAsset(studentAssetRequest.asset);
  }

  generateStarterState() {}

  private copyAndAttachStudentAsset(studentAsset: any): void {
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

  attachStudentAsset(studentAsset: any): any {
    return this.StudentAssetService.copyAssetForReference(studentAsset).then((copiedAsset) => {
      const attachment = {
        studentAssetId: copiedAsset.id,
        iconURL: copiedAsset.iconURL,
        url: copiedAsset.url,
        type: copiedAsset.type
      };
      this.attachments.push(attachment);
      this.studentDataChanged();
    });
  }

  removeAttachment(attachment: any): void {
    if (this.attachments.indexOf(attachment) !== -1) {
      this.attachments.splice(this.attachments.indexOf(attachment), 1);
      this.studentDataChanged();
    }
  }

  subscribeToStudentWorkSavedToServer(): void {
    this.subscriptions.add(
      this.StudentDataService.studentWorkSavedToServer$.subscribe((componentState: any) => {
        this.handleStudentWorkSavedToServer(componentState);
        if (this.isFromConnectedComponent(componentState)) {
          this.connectedComponentStudentDataSaved();
        }
      })
    );
  }

  handleStudentWorkSavedToServer(componentState: any): void {
    if (this.isForThisComponent(componentState)) {
      this.setIsDirty(false);
      this.emitComponentDirty(this.getIsDirty());
      this.latestComponentState = componentState;
      if (componentState.isSubmit) {
        this.lockIfNecessary();
        this.setIsSubmitDirty(false);
        this.emitComponentSubmitDirty(this.isSubmitDirty);
      }
      this.handleStudentWorkSavedToServerAdditionalProcessing(componentState);
    }
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
      if (this.hasAnySubmissions(componentStates)) {
        this.isDisabled = true;
      }
    }
  }

  private hasAnySubmissions(componentStates: any): boolean {
    return componentStates.some((componentState) => componentState.isSubmit);
  }

  private isLockAfterSubmit(): boolean {
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
          componentStates.push(copy(componentState));
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
    if (this.isPreviewMode()) {
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

  tryDisableComponent(): void {
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.isDisabled = true;
      this.isSubmitButtonDisabled = true;
    }
  }

  hasMaxSubmitCountAndUsedAllSubmits() {
    return this.hasMaxSubmitCount() && this.hasUsedAllSubmits();
  }

  getNumberOfSubmitsLeft(): number {
    return this.getMaxSubmitCount() - this.submitCounter;
  }

  getMaxSubmitCount(): number {
    return this.component.content.maxSubmitCount;
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
      if (this.isPreviewMode()) {
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
    this.clearLatestComponentState();
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

  clearLatestComponentState(): void {
    this.latestComponentState = null;
  }

  createComponentStateAndBroadcast(action: string): void {
    this.createComponentState(action).then((componentState: any) => {
      this.emitComponentStudentDataChanged(componentState);
      if (this.mode === 'preview') {
        this.starterStateChangedEvent.emit(this.generateStarterState());
      }
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
      this.latestComponentState = latestComponentState;
      if (latestComponentState.isSubmit) {
        this.setIsSubmitDirty(false);
        this.emitComponentSubmitDirty(false);
      } else {
        this.setIsSubmitDirty(true);
        this.emitComponentSubmitDirty(true);
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
    const dialogRef = this.dialog.open(GenerateImageDialogComponent, {
      data: componentState
    });
    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe((result) => {
        resolve(result);
      });
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

  protected showStudentAssets(): void {
    this.dialog.open(StudentAssetsDialogComponent, {
      data: this.component,
      panelClass: 'dialog-md'
    });
  }

  importWorkAsBackground(componentState: any): void {
    const connectedComponent = this.component.getConnectedComponent(
      componentState.nodeId,
      componentState.componentId
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

  createAutoScoreAnnotation(data: any): any {
    return this.AnnotationService.createAutoScoreAnnotation(
      this.ConfigService.getRunId(),
      this.ConfigService.getPeriodId(),
      this.nodeId,
      this.componentId,
      this.ConfigService.getWorkgroupId(),
      data
    );
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

  registerNotebookItemChosenListener(): void {
    this.subscriptions.add(
      this.NotebookService.notebookItemChosen$.subscribe(({ requester, notebookItem }) => {
        if (requester === `${this.nodeId}-${this.componentId}`) {
          const studentWorkId = notebookItem.content.studentWorkIds[0];
          this.importWorkByStudentWorkId(studentWorkId);
        }
      })
    );
  }

  copyPublicNotebookItemButtonClicked(): void {
    this.NotebookService.setInsertMode({
      nodeId: this.nodeId,
      componentId: this.componentId,
      insertMode: true,
      requester: this.nodeId + '-' + this.componentId,
      visibleSpace: 'public'
    });
    this.NotebookService.setNotesVisible(true);
  }

  getElementById(id: string, getFirstResult: boolean = false): any {
    if (getFirstResult) {
      return $(`#${id}`)[0];
    } else {
      return $(`#${id}`);
    }
  }

  isFromConnectedComponent(componentState: any) {
    if (this.componentContent.connectedComponents != null) {
      for (const connectedComponent of this.componentContent.connectedComponents) {
        if (
          connectedComponent.nodeId === componentState.nodeId &&
          connectedComponent.componentId === componentState.componentId
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * This function is called when a connected component of this component saves student data.
   * This was added to handle a race condition when a step has a connected component on a previous
   * step but the connected component student work on the previous step was not being imported
   * because it wasn't being saved in time.
   * Here is an example of what was happening
   * - Student generates work on step 1 but does not click the save button
   * - Student goes to step 2 which triggers a promise to save the student work on step 1
   * - Step 2 is loaded and checks if there is any work it needs to import from step 1
   * - The work in step 1 has not saved yet so step 2 does not import any work and loads without
   *   importing any work
   * - The work from step 1 is then saved
   * Here is the additional process that this function performs to fix this problem
   * - Step 2 listens for when work is saved on step 1
   * - When the work for step 1 is saved, step 2 checks to see if it needs to import that work
   */
  connectedComponentStudentDataSaved() {
    if (this.isHandleConnectedComponentAfterConnectedComponentStudentDataSaved()) {
      this.handleConnectedComponents();
    }
  }

  isHandleConnectedComponentAfterConnectedComponentStudentDataSaved() {
    const latestComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
      this.nodeId,
      this.componentId
    );
    return latestComponentState == null && !this.isDirty;
  }

  setSubmitCounter(componentState: any): void {
    const submitCounter = componentState?.studentData?.submitCounter;
    if (submitCounter != null) {
      this.submitCounter = submitCounter;
    }
  }

  createNewComponentState(): Partial<ComponentState> {
    return {
      clientSaveTime: new Date().getTime()
    };
  }
}
