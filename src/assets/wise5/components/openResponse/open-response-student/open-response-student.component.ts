import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { WiseLinkService } from '../../../../../app/services/wiseLinkService';
import { MatDialog } from '@angular/material/dialog';
import { timeout } from 'rxjs/operators';
import { DialogWithoutCloseComponent } from '../../../directives/dialog-without-close/dialog-without-close.component';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { CRaterService } from '../../../services/cRaterService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { CRaterResponse } from '../../common/cRater/CRaterResponse';
import { FeedbackRuleEvaluator } from '../../common/feedbackRule/FeedbackRuleEvaluator';
import { FeedbackRule } from '../../common/feedbackRule/FeedbackRule';
import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';
import { OpenResponseService } from '../openResponseService';
import { copy } from '../../../common/object/object';
import { RawCRaterResponse } from '../../common/cRater/RawCRaterResponse';
import { hasConnectedComponent } from '../../../common/ComponentContent';
import { ConstraintService } from '../../../services/constraintService';
import { CRaterPingService } from '../../../services/cRaterPingService';
import { OpenResponseContent } from '../OpenResponseContent';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';
import { SpeechToTextComponent } from '../speech-to-text/speech-to-text.component';
import { AudioRecorderComponent } from '../audio-recorder/audio-recorder.component';
import { ComponentSaveSubmitButtonsComponent } from '../../../directives/component-save-submit-buttons/component-save-submit-buttons.component';
import { ComponentAnnotationsComponent } from '../../../directives/componentAnnotations/component-annotations.component';

@Component({
  imports: [
    ComponentHeaderComponent,
    MatButton,
    MatIcon,
    MatFormField,
    MatInput,
    CdkTextareaAutosize,
    FormsModule,
    SpeechToTextComponent,
    AudioRecorderComponent,
    ComponentSaveSubmitButtonsComponent,
    ComponentAnnotationsComponent
  ],
  providers: [CRaterPingService],
  selector: 'open-response-student',
  styleUrl: 'open-response-student.component.scss',
  templateUrl: 'open-response-student.component.html'
})
export class OpenResponseStudent extends ComponentStudent {
  protected contextHtml: SafeHtml = '';
  private wiseLinkService = inject(WiseLinkService);
  audioAttachments: any[] = [];
  cRaterTimeout: number = 40000;
  isPublicSpaceExist: boolean = false;
  isStudentAudioRecordingEnabled: boolean = false;
  protected speechToTextEnabled: boolean;
  studentResponse: string = '';

  constructor(
    protected annotationService: AnnotationService,
    private changeDetector: ChangeDetectorRef,
    protected componentService: ComponentService,
    private constraintService: ConstraintService,
    protected configService: ConfigService,
    private cRaterPingService: CRaterPingService,
    private cRaterService: CRaterService,
    protected dialog: MatDialog,
    private openResponseService: OpenResponseService,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    protected studentAssetService: StudentAssetService,
    protected studentDataService: StudentDataService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      studentAssetService,
      studentDataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.contextHtml = this.wiseLinkService.generateHtmlWithWiseLink(
      this.componentContent.context || ''
    );
    if (hasConnectedComponent(this.componentContent, 'showWork')) {
      this.handleConnectedComponents();
    } else if (
      this.componentState != null &&
      this.openResponseService.componentStateHasStudentWork(
        this.componentState,
        this.componentContent
      )
    ) {
      this.setStudentWork(this.componentState);
    } else if (this.component.hasConnectedComponent()) {
      this.handleConnectedComponents();
    } else if (this.componentState == null) {
      if (this.component.hasConnectedComponent()) {
        this.handleConnectedComponents();
      } else if (this.componentContent.starterSentence != null) {
        this.studentResponse = this.componentContent.starterSentence;
      }
    }

    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.isDisabled = true;
    }
    this.disableComponentIfNecessary();
    this.isPublicSpaceExist = this.projectService.isSpaceExists('public');
    this.registerNotebookItemChosenListener();
    this.isStudentAudioRecordingEnabled = this.componentContent.isStudentAudioRecordingEnabled;
    this.speechToTextEnabled = this.projectService.getSpeechToTextSettings()?.enabled;

    // load script for this component, if any
    const script = this.componentContent.script;
    if (script != null) {
      this.projectService.retrieveScript(script).then((script) => {
        new Function(script).call(this);
      });
    }
    this.updateAudioAttachments();
    this.pingCRaterEndpoint();
    this.broadcastDoneRenderingComponent();
  }

  private pingCRaterEndpoint(): void {
    if (this.isCRaterEnabled()) {
      this.cRaterPingService.startPinging(this.getItemId());
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.isCRaterEnabled()) {
      this.cRaterPingService.stopPinging(this.getItemId());
    }
  }

  private getItemId(): string {
    return (this.component.content as OpenResponseContent).cRater.itemId;
  }

  performSubmit(submitTriggeredBy: string): void {
    super.performSubmit(submitTriggeredBy);
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.isDisabled = true;
    }
  }

  setStudentWork(componentState: any): void {
    if (componentState != null) {
      const studentData = componentState.studentData;
      if (studentData != null) {
        const response = studentData.response;
        if (response != null) {
          this.studentResponse = response;
        }
        const submitCounter = studentData.submitCounter;
        if (submitCounter != null) {
          this.submitCounter = submitCounter;
        }
        if (studentData.attachments != null) {
          this.attachments = studentData.attachments;
        }
        this.processLatestStudentWork();
      }
    }
  }

  hasSubmitMessage(): boolean {
    return true;
  }

  hasFeedback(): boolean {
    return (
      this.isCRaterEnabled() &&
      (this.componentContent.cRater.showFeedback || this.componentContent.cRater.showScore)
    );
  }

  confirmSubmit(numberOfSubmitsLeft: number): boolean {
    if (this.hasFeedback()) {
      return this.submitWithFeedback(numberOfSubmitsLeft);
    } else {
      return this.submitWithoutFeedback(numberOfSubmitsLeft);
    }
  }

  submitWithFeedback(numberOfSubmitsLeft: number): boolean {
    let isPerformSubmit = false;
    if (numberOfSubmitsLeft <= 0) {
      alert($localize`You do not have any more chances to receive feedback on your answer.`);
    } else if (numberOfSubmitsLeft === 1) {
      isPerformSubmit = confirm(
        $localize`You have 1 chance to receive feedback on your answer so this should be your best work.\n\nAre you ready to receive feedback on this answer?`
      );
    } else if (numberOfSubmitsLeft > 1) {
      isPerformSubmit = confirm(
        $localize`You have ${numberOfSubmitsLeft} chances to receive feedback on your answer so this should be your best work.\n\nAre you ready to receive feedback on this answer?`
      );
    }
    return isPerformSubmit;
  }

  submitWithoutFeedback(numberOfSubmitsLeft: number): boolean {
    let isPerformSubmit = false;
    if (numberOfSubmitsLeft <= 0) {
      alert($localize`You do not have any more chances to receive feedback on your answer.`);
    } else if (numberOfSubmitsLeft === 1) {
      isPerformSubmit = confirm(
        $localize`You have ${numberOfSubmitsLeft} chance to receive feedback on your answer so this should be your best work.\n\nAre you ready to receive feedback on this answer?`
      );
    } else if (numberOfSubmitsLeft > 1) {
      isPerformSubmit = confirm(
        $localize`You have ${numberOfSubmitsLeft} chances to submit your answer so this should be your best work.\n\nAre you ready to submit this answer?`
      );
    }
    return isPerformSubmit;
  }

  getStudentResponse(): any {
    return this.studentResponse;
  }

  protected appendStudentResponse(text: string): void {
    this.studentResponse += text;
    this.studentDataChanged();
  }

  /**
   * Create a new component state populated with the student data
   * @param action the action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return a promise that will return a component state
   */
  createComponentState(action: any): any {
    const componentState: any = this.createNewComponentState();
    const studentData: any = {};
    const response = this.getStudentResponse();
    studentData.response = response;
    studentData.attachments = copy(this.attachments); // create a copy without reference to original array
    studentData.submitCounter = this.submitCounter;
    if (this.parentStudentWorkIds != null) {
      studentData.parentStudentWorkIds = this.parentStudentWorkIds;
    }
    componentState.isSubmit = this.isSubmit;
    componentState.studentData = studentData;
    componentState.componentType = 'OpenResponse';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    componentState.isCompleted = this.openResponseService.isCompletedV2(
      this.projectService.getNodeById(this.nodeId),
      this.componentContent,
      { componentStates: [componentState], events: [], annotations: [] }
    );
    const promise = new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
    this.isSubmit = false;
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.isDisabled = true;
    }
    return promise;
  }

  /**
   * Perform any additional processing that is required before returning the component state
   * Note: this function must call deferred.resolve() otherwise student work will not be saved
   * @param deferred a deferred object
   * @param componentState the component state
   * @param action the action that we are creating the component state for
   * e.g. 'submit', 'save', 'change'
   */
  createComponentStateAdditionalProcessing(
    deferred: any,
    componentState: any,
    action: string
  ): void {
    if (this.shouldPerformCRaterScoring(componentState, action)) {
      this.performCRaterScoring(deferred, componentState);
    } else if (
      this.projectService.hasAdditionalProcessingFunctions(this.nodeId, this.componentId)
    ) {
      this.processAdditionalFunctions(deferred, componentState, action);
    } else {
      this.tryAddDefaultFeedback(componentState);
      deferred.resolve(componentState);
    }
  }

  private tryAddDefaultFeedback(componentState: any) {
    if (this.isSubmit && this.hasDefaultFeedback()) {
      this.addDefaultFeedback(componentState);
    }
  }

  private processAdditionalFunctions(deferred: any, componentState: any, action: any): void {
    const allPromises = this.createAdditionalProcessingFunctionPromises(componentState, action);
    Promise.all(allPromises).then(() => {
      deferred.resolve(componentState);
    });
  }

  private createAdditionalProcessingFunctionPromises(componentState: any, action: any): any {
    const additionalProcessingFunctions = this.projectService.getAdditionalProcessingFunctions(
      this.nodeId,
      this.componentId
    );
    const allPromises = [];
    for (const additionalProcessingFunction of additionalProcessingFunctions) {
      const promise = new Promise((resolve, reject) => {
        additionalProcessingFunction({ resolve: resolve, reject: reject }, componentState, action);
      });
      allPromises.push(promise);
    }
    return allPromises;
  }

  private shouldPerformCRaterScoring(componentState: any, action = 'change'): boolean {
    return (
      (action === 'submit' && componentState.isSubmit && this.isCRaterScoreOnSubmit()) ||
      (action === 'save' && this.isCRaterScoreOnSave()) ||
      (action === 'change' && this.isCRaterScoreOnChange())
    );
  }

  private performCRaterScoring(deferred: any, componentState: any): void {
    const dialogRef = this.dialog.open(DialogWithoutCloseComponent, {
      data: {
        content: $localize`We are scoring your work...`,
        title: $localize`Please Wait`
      },
      disableClose: true
    });
    this.cRaterService
      .makeCRaterScoringRequest(
        this.cRaterService.getCRaterItemId(this.componentContent),
        new Date().getTime(),
        this.studentResponse
      )
      .pipe(timeout(this.cRaterTimeout))
      .subscribe(
        (response: any) => {
          this.cRaterSuccessResponse(response.responses, componentState, deferred, dialogRef);
        },
        () => {
          this.cRaterErrorResponse(componentState, deferred, dialogRef);
        }
      );
  }

  private cRaterErrorResponse(componentState: any, deferred: any, dialogRef: any): void {
    alert(
      $localize`There was an issue scoring your work. Please try again.\nIf this problem continues, let your teacher know and move on to the next activity. Your work will still be saved.`
    );
    dialogRef.close();
    componentState.isSubmit = false;
    componentState.studentData.submitCounter--;
    this.submitCounter--;
    deferred.resolve(componentState);
  }

  private cRaterSuccessResponse(
    responses: RawCRaterResponse,
    componentState: any,
    deferred: any,
    dialogRef: any
  ): void {
    const cRaterResponse = this.cRaterService.getCRaterResponse(responses, this.submitCounter);
    let score = cRaterResponse.score;
    if (cRaterResponse.scores != null) {
      const maxSoFarFunc = (accumulator, currentValue) => {
        return Math.max(accumulator, currentValue.score);
      };
      score = cRaterResponse.scores.reduce(maxSoFarFunc, 0);
    }
    if (score != null) {
      this.processCRaterSuccessResponse(score, cRaterResponse, componentState);
    }
    dialogRef.close();
    deferred.resolve(componentState);
  }

  private processCRaterSuccessResponse(
    score: number,
    response: CRaterResponse,
    componentState: any
  ): void {
    let previousScore = null;
    const autoScoreAnnotationData: any = {
      value: score,
      maxAutoScore: this.projectService.getMaxScoreForComponent(this.nodeId, this.componentId),
      autoGrader: 'cRater'
    };
    if (response.scores != null) {
      autoScoreAnnotationData.scores = response.scores;
    }
    if (response.ideas != null) {
      autoScoreAnnotationData.ideas = response.ideas;
    }

    let autoScoreAnnotation = this.createAutoScoreAnnotation(autoScoreAnnotationData);
    const latestAnnotations = this.annotationService.getLatestComponentAnnotations(
      this.nodeId,
      this.componentId,
      this.workgroupId
    );

    if (
      latestAnnotations != null &&
      latestAnnotations.score != null &&
      latestAnnotations.score.data != null
    ) {
      previousScore = latestAnnotations.score.data.value;
    }

    componentState.annotations = [autoScoreAnnotation];

    let autoComment = null;
    const submitCounter = this.submitCounter;
    let feedbackRuleId = null;

    if (this.componentContent.cRater.enableMultipleAttemptScoringRules && submitCounter > 1) {
      // this step has multiple attempt scoring rules and this is a subsequent submit
      // get the feedback based upon the previous score and current score
      autoComment = this.cRaterService.getMultipleAttemptCRaterFeedbackTextByScore(
        this.componentContent,
        previousScore,
        score
      );
    } else {
      if (this.hasFeedbackRules()) {
        const feedbackRuleEvaluator = new FeedbackRuleEvaluator(
          new FeedbackRuleComponent(
            this.getFeedbackRules(),
            this.getMaxSubmitCount(),
            this.isMultipleFeedbackTextsForSameRuleAllowed()
          ),
          this.configService,
          this.constraintService
        );
        const rule: FeedbackRule = feedbackRuleEvaluator.getFeedbackRule([response]);
        autoComment = this.getFeedbackText(rule);
        feedbackRuleId = rule.id;
      } else {
        autoComment = this.cRaterService.getCRaterFeedbackTextByScore(this.componentContent, score);
      }
    }

    if (autoComment != null) {
      const autoCommentAnnotationData: any = {};
      autoCommentAnnotationData.value = autoComment;
      autoCommentAnnotationData.autoGrader = 'cRater';
      if (feedbackRuleId != null) {
        autoCommentAnnotationData.feedbackRuleId = feedbackRuleId;
      }
      const autoCommentAnnotation = this.createAutoCommentAnnotation(autoCommentAnnotationData);
      componentState.annotations.push(autoCommentAnnotation);
    }
    if (
      this.componentContent.enableNotifications &&
      this.componentContent.notificationSettings &&
      this.componentContent.notificationSettings.notifications
    ) {
      const notificationForScore: any = this.projectService.getNotificationByScore(
        this.componentContent,
        previousScore,
        score
      );
      if (notificationForScore != null) {
        notificationForScore.score = score;
        notificationForScore.nodeId = this.nodeId;
        notificationForScore.componentId = this.componentId;
        this.notificationService.sendNotificationForScore(notificationForScore);
      }
    }
  }

  createAutoScoreAnnotation(data: any): any {
    const runId = this.configService.getRunId();
    const periodId = this.configService.getPeriodId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const toWorkgroupId = this.configService.getWorkgroupId();
    const annotation = this.annotationService.createAutoScoreAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      toWorkgroupId,
      data
    );
    return annotation;
  }

  createAutoCommentAnnotation(data: any): any {
    const runId = this.configService.getRunId();
    const periodId = this.configService.getPeriodId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const toWorkgroupId = this.configService.getWorkgroupId();
    const annotation = this.annotationService.createAutoCommentAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      toWorkgroupId,
      data
    );
    return annotation;
  }

  private hasFeedbackRules(): boolean {
    return (
      this.componentContent.cRater.feedback?.enabled &&
      this.componentContent.cRater.feedback.rules.length > 0
    );
  }

  private getFeedbackText(rule: FeedbackRule): string {
    const annotationsForFeedbackRule = this.annotationService
      .getAnnotations()
      .filter(
        (annotation) =>
          this.isForThisComponent(annotation) && annotation.data.feedbackRuleId === rule.id
      );
    return rule.feedback[annotationsForFeedbackRule.length % rule.feedback.length];
  }

  snipButtonClicked($event: any): void {
    if (this.isDirty) {
      const studentWorkSavedToServerSubscription =
        this.studentDataService.studentWorkSavedToServer$.subscribe((componentState: any) => {
          if (
            componentState &&
            this.nodeId === componentState.nodeId &&
            this.componentId === componentState.componentId
          ) {
            const imageObject = null;
            const noteText = componentState.studentData.response;
            const isEditTextEnabled = false;
            const isFileUploadEnabled = false;
            this.notebookService.addNote(
              this.studentDataService.getCurrentNodeId(),
              imageObject,
              noteText,
              [componentState.id],
              isEditTextEnabled,
              isFileUploadEnabled
            );
            studentWorkSavedToServerSubscription.unsubscribe();
          }
        });
      this.saveButtonClicked(); // trigger a save
    } else {
      const studentWork = this.studentDataService.getLatestComponentStateByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
      const imageObject = null;
      const noteText = studentWork.studentData.response;
      const isEditTextEnabled = false;
      const isFileUploadEnabled = false;
      this.notebookService.addNote(
        this.studentDataService.getCurrentNodeId(),
        imageObject,
        noteText,
        [studentWork.id],
        isEditTextEnabled,
        isFileUploadEnabled
      );
    }
  }

  isCRaterEnabled(): boolean {
    return this.cRaterService.isCRaterEnabled(this.componentContent);
  }

  private isCRaterScoreOnSave(): boolean {
    return this.cRaterService.isCRaterScoreOnEvent(this.componentContent, 'save');
  }

  private isCRaterScoreOnSubmit(): boolean {
    return this.cRaterService.isCRaterScoreOnEvent(this.componentContent, 'submit');
  }

  private isCRaterScoreOnChange(): boolean {
    return this.cRaterService.isCRaterScoreOnEvent(this.componentContent, 'change');
  }

  /**
   * Create a component state with the merged student responses
   * @param componentStates an array of component states
   * @return a component state with the merged student responses
   */
  createMergedComponentState(componentStates: any[]): any {
    let mergedComponentState: any = this.createNewComponentState();
    if (componentStates != null) {
      let mergedResponse = '';
      for (let c = 0; c < componentStates.length; c++) {
        let componentState = componentStates[c];
        if (componentState != null) {
          let studentData = componentState.studentData;
          if (studentData != null) {
            let response = studentData.response;
            if (response != null && response != '') {
              if (mergedResponse != '') {
                mergedResponse += '\n';
              }
              mergedResponse += response;
            }
          }
        }
      }
      if (mergedResponse != null && mergedResponse != '') {
        mergedComponentState.studentData = {};
        mergedComponentState.studentData.response = mergedResponse;
      }
    }
    return mergedComponentState;
  }

  studentDataChanged(): void {
    this.setIsDirtyAndBroadcast();
    if (this.studentResponse === '') {
      this.setIsSubmitDirty(false);
    } else {
      this.setIsSubmitDirtyAndBroadcast();
    }
    this.clearLatestComponentState();
    const action = 'change';
    this.createComponentStateAndBroadcast(action);
    this.updateAudioAttachments();
  }

  attachAudioRecording(audioFile: any): void {
    this.studentAssetService.uploadAsset(audioFile).then((studentAsset) => {
      this.attachStudentAsset(studentAsset).then(() => {
        this.studentAssetService.deleteAsset(studentAsset).then(() => this.studentDataChanged());
      });
    });
  }

  private updateAudioAttachments(): void {
    this.audioAttachments = this.attachments.filter((attachment) => attachment.type === 'audio');
    this.changeDetector.detectChanges();
  }

  getFeedbackRules(): FeedbackRule[] {
    return this.componentContent.cRater.feedback.rules;
  }

  isMultipleFeedbackTextsForSameRuleAllowed(): boolean {
    return true;
  }
}
