import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { timeout } from 'rxjs/operators';
import { DialogWithoutCloseComponent } from '../../../directives/dialog-without-close/dialog-without-close.component';
import { AnnotationService } from '../../../services/annotationService';
import { AudioRecorderService } from '../../../services/audioRecorderService';
import { ConfigService } from '../../../services/configService';
import { CRaterService } from '../../../services/cRaterService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { OpenResponseService } from '../openResponseService';

@Component({
  selector: 'open-response-student',
  templateUrl: 'open-response-student.component.html',
  styleUrls: ['open-response-student.component.scss']
})
export class OpenResponseStudent extends ComponentStudent {
  audioRecordingInterval: any;
  audioRecordingMaxTime: number = 60000;
  audioRecordingStartTime: number = 0;
  cRaterTimeout: number = 40000;
  isPublicSpaceExist: boolean = false;
  isRecordingAudio: boolean = false;
  isStudentAudioRecordingEnabled: boolean = false;
  studentResponse: string = '';

  constructor(
    protected AnnotationService: AnnotationService,
    private AudioRecorderService: AudioRecorderService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    private CRaterService: CRaterService,
    protected dialog: MatDialog,
    private OpenResponseService: OpenResponseService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private NotificationService: NotificationService,
    private ProjectService: ProjectService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      dialog,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (
      this.componentState != null &&
      this.OpenResponseService.componentStateHasStudentWork(
        this.componentState,
        this.componentContent
      )
    ) {
      this.setStudentWork(this.componentState);
    } else if (this.UtilService.hasConnectedComponent(this.componentContent)) {
      this.handleConnectedComponents();
    } else if (this.componentState == null) {
      if (this.UtilService.hasConnectedComponent(this.componentContent)) {
        /*
         * the student does not have any work and there are connected
         * components so we will get the work from the connected
         * components
         */
        this.handleConnectedComponents();
      } else if (this.componentContent.starterSentence != null) {
        /*
         * the student has not done any work and there is a starter sentence
         * so we will populate the textarea with the starter sentence
         */
        this.studentResponse = this.componentContent.starterSentence;
      }
    }

    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.isDisabled = true;
    }

    this.disableComponentIfNecessary();

    this.isPublicSpaceExist = this.ProjectService.isSpaceExists('public');
    this.registerNotebookItemChosenListener();
    this.registerAudioRecordedListener();
    this.isStudentAudioRecordingEnabled =
      this.componentContent.isStudentAudioRecordingEnabled || false;

    // load script for this component, if any
    const script = this.componentContent.script;
    if (script != null) {
      this.ProjectService.retrieveScript(script).then((script) => {
        new Function(script).call(this);
      });
    }

    this.broadcastDoneRenderingComponent();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  performSubmit(submitTriggeredBy: string): void {
    super.performSubmit(submitTriggeredBy);
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.isDisabled = true;
    }
  }

  /**
   * Populate the student work into the component
   * @param componentState the component state to populate into the component
   */
  setStudentWork(componentState) {
    if (componentState != null) {
      const studentData = componentState.studentData;

      if (studentData != null) {
        const response = studentData.response;

        if (response != null) {
          // populate the text the student previously typed
          this.studentResponse = response;
        }

        const submitCounter = studentData.submitCounter;

        if (submitCounter != null) {
          // populate the submit counter
          this.submitCounter = submitCounter;
        }

        if (studentData.attachments != null) {
          this.attachments = studentData.attachments;
        }

        this.processLatestStudentWork();
      }
    }
  }

  hasSubmitMessage() {
    return true;
  }

  hasFeedback() {
    return (
      this.isCRaterEnabled() &&
      (this.componentContent.cRater.showFeedback || this.componentContent.cRater.showScore)
    );
  }

  confirmSubmit(numberOfSubmitsLeft) {
    if (this.hasFeedback()) {
      return this.submitWithFeedback(numberOfSubmitsLeft);
    } else {
      return this.submitWithoutFeedback(numberOfSubmitsLeft);
    }
  }

  submitWithFeedback(numberOfSubmitsLeft) {
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

  submitWithoutFeedback(numberOfSubmitsLeft) {
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

  /**
   * Get the student response
   */
  getStudentResponse() {
    return this.studentResponse;
  }

  /**
   * Create a new component state populated with the student data
   * @param action the action that is triggering creating of this component state
   * e.g. 'submit', 'save', 'change'
   * @return a promise that will return a component state
   */
  createComponentState(action) {
    // create a new component state
    const componentState: any = this.NodeService.createNewComponentState();

    // set the response into the component state
    const studentData: any = {};

    // get the text the student typed
    const response = this.getStudentResponse();

    studentData.response = response;
    studentData.attachments = this.UtilService.makeCopyOfJSONObject(this.attachments); // create a copy without reference to original array

    // set the submit counter
    studentData.submitCounter = this.submitCounter;

    if (this.parentStudentWorkIds != null) {
      studentData.parentStudentWorkIds = this.parentStudentWorkIds;
    }

    // set the flag for whether the student submitted this work
    componentState.isSubmit = this.isSubmit;

    // set the student data into the component state
    componentState.studentData = studentData;

    // set the component type
    componentState.componentType = 'OpenResponse';

    // set the node id
    componentState.nodeId = this.nodeId;

    // set the component id
    componentState.componentId = this.componentId;

    componentState.isCompleted = this.OpenResponseService.isCompletedV2(
      this.ProjectService.getNodeById(this.nodeId),
      this.componentContent,
      { componentStates: [componentState], events: [], annotations: [] }
    );

    /*
     * perform any additional processing that is required before returning
     * the component state
     */
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
   * Perform any additional processing that is required before returning the
   * component state
   * Note: this function must call deferred.resolve() otherwise student work
   * will not be saved
   * @param deferred a deferred object
   * @param componentState the component state
   * @param action the action that we are creating the component state for
   * e.g. 'submit', 'save', 'change'
   */
  createComponentStateAdditionalProcessing(deferred, componentState, action) {
    if (this.shouldPerformCRaterScoring(componentState, action)) {
      this.performCRaterScoring(deferred, componentState);
    } else if (
      this.ProjectService.hasAdditionalProcessingFunctions(this.nodeId, this.componentId)
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

  private processAdditionalFunctions(deferred: any, componentState: any, action: any) {
    const allPromises = this.createAdditionalProcessingFunctionPromises(componentState, action);
    Promise.all(allPromises).then(() => {
      deferred.resolve(componentState);
    });
  }

  private createAdditionalProcessingFunctionPromises(componentState: any, action: any) {
    const additionalProcessingFunctions = this.ProjectService.getAdditionalProcessingFunctions(
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
    this.CRaterService.makeCRaterScoringRequest(
      this.CRaterService.getCRaterItemId(this.componentContent),
      new Date().getTime(),
      this.studentResponse
    )
      .pipe(timeout(this.cRaterTimeout))
      .subscribe(
        (data: any) => {
          this.cRaterSuccessResponse(data, componentState, deferred, dialogRef);
        },
        () => {
          this.cRaterErrorResponse(componentState, deferred, dialogRef);
        }
      );
  }

  private cRaterErrorResponse(componentState: any, deferred: any, dialogRef: any) {
    alert(
      $localize`There was an issue scoring your work. Please try again.\nIf this problem continues, let your teacher know and move on to the next activity. Your work will still be saved.`
    );
    dialogRef.close();
    componentState.isSubmit = false;
    componentState.studentData.submitCounter--;
    this.submitCounter--;
    deferred.resolve(componentState);
  }

  private cRaterSuccessResponse(data: any, componentState: any, deferred: any, dialogRef: any) {
    let score = data.score;
    let concepts = data.concepts;
    if (data.scores != null) {
      const maxSoFarFunc = (accumulator, currentValue) => {
        return Math.max(accumulator, currentValue.score);
      };
      score = data.scores.reduce(maxSoFarFunc, 0);
    }
    if (score != null) {
      this.processCRaterSuccessResponse(score, concepts, data, componentState);
    }
    dialogRef.close();
    deferred.resolve(componentState);
  }

  private processCRaterSuccessResponse(score: any, concepts: any, data: any, componentState: any) {
    let previousScore = null;
    const autoScoreAnnotationData: any = {
      value: score,
      maxAutoScore: this.ProjectService.getMaxScoreForComponent(this.nodeId, this.componentId),
      concepts: concepts,
      autoGrader: 'cRater'
    };
    if (data.scores != null) {
      autoScoreAnnotationData.scores = data.scores;
    }
    if (data.ideas != null) {
      autoScoreAnnotationData.ideas = data.ideas;
    }

    let autoScoreAnnotation = this.createAutoScoreAnnotation(autoScoreAnnotationData);
    let annotationGroupForScore = null;
    const latestAnnotations = this.AnnotationService.getLatestComponentAnnotations(
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

    if (this.componentContent.cRater.enableMultipleAttemptScoringRules && submitCounter > 1) {
      /*
       * this step has multiple attempt scoring rules and this is
       * a subsequent submit
       */
      // get the feedback based upon the previous score and current score
      autoComment = this.CRaterService.getMultipleAttemptCRaterFeedbackTextByScore(
        this.componentContent,
        previousScore,
        score
      );
    } else {
      autoComment = this.CRaterService.getCRaterFeedbackTextByScore(this.componentContent, score);
    }

    if (autoComment != null) {
      const autoCommentAnnotationData: any = {};
      autoCommentAnnotationData.value = autoComment;
      autoCommentAnnotationData.concepts = concepts;
      autoCommentAnnotationData.autoGrader = 'cRater';

      const autoCommentAnnotation = this.createAutoCommentAnnotation(autoCommentAnnotationData);
      componentState.annotations.push(autoCommentAnnotation);
    }
    if (
      this.componentContent.enableNotifications &&
      this.componentContent.notificationSettings &&
      this.componentContent.notificationSettings.notifications
    ) {
      const notificationForScore: any = this.ProjectService.getNotificationByScore(
        this.componentContent,
        previousScore,
        score
      );
      if (notificationForScore != null) {
        notificationForScore.score = score;
        notificationForScore.nodeId = this.nodeId;
        notificationForScore.componentId = this.componentId;
        this.NotificationService.sendNotificationForScore(notificationForScore);
      }
    }
  }

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
  createAutoScoreAnnotation(data) {
    const runId = this.ConfigService.getRunId();
    const periodId = this.ConfigService.getPeriodId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const toWorkgroupId = this.ConfigService.getWorkgroupId();

    // create the auto score annotation
    const annotation = this.AnnotationService.createAutoScoreAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      toWorkgroupId,
      data
    );

    return annotation;
  }

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
  createAutoCommentAnnotation(data) {
    const runId = this.ConfigService.getRunId();
    const periodId = this.ConfigService.getPeriodId();
    const nodeId = this.nodeId;
    const componentId = this.componentId;
    const toWorkgroupId = this.ConfigService.getWorkgroupId();

    // create the auto comment annotation
    const annotation = this.AnnotationService.createAutoCommentAnnotation(
      runId,
      periodId,
      nodeId,
      componentId,
      toWorkgroupId,
      data
    );

    return annotation;
  }

  snipButtonClicked($event) {
    if (this.isDirty) {
      const studentWorkSavedToServerSubscription = this.StudentDataService.studentWorkSavedToServer$.subscribe(
        (componentState: any) => {
          if (
            componentState &&
            this.nodeId === componentState.nodeId &&
            this.componentId === componentState.componentId
          ) {
            const imageObject = null;
            const noteText = componentState.studentData.response;
            const isEditTextEnabled = false;
            const isFileUploadEnabled = false;
            this.NotebookService.addNote(
              imageObject,
              noteText,
              [componentState.id],
              isEditTextEnabled,
              isFileUploadEnabled
            );
            studentWorkSavedToServerSubscription.unsubscribe();
          }
        }
      );
      this.saveButtonClicked(); // trigger a save
    } else {
      const studentWork = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(
        this.nodeId,
        this.componentId
      );
      const imageObject = null;
      const noteText = studentWork.studentData.response;
      const isEditTextEnabled = false;
      const isFileUploadEnabled = false;
      this.NotebookService.addNote(
        imageObject,
        noteText,
        [studentWork.id],
        isEditTextEnabled,
        isFileUploadEnabled
      );
    }
  }

  /**
   * Check if CRater is enabled for this component
   * @returns whether CRater is enabled for this component
   */
  isCRaterEnabled() {
    return this.CRaterService.isCRaterEnabled(this.componentContent);
  }

  /**
   * Check if CRater is set to score on save
   * @returns whether CRater is set to score on save
   */
  isCRaterScoreOnSave() {
    let result = false;

    if (this.CRaterService.isCRaterScoreOnSave(this.componentContent)) {
      result = true;
    }

    return result;
  }

  /**
   * Check if CRater is set to score on submit
   * @returns whether CRater is set to score on submit
   */
  isCRaterScoreOnSubmit() {
    let result = false;

    if (this.CRaterService.isCRaterScoreOnSubmit(this.componentContent)) {
      result = true;
    }

    return result;
  }

  /**
   * Check if CRater is set to score on change
   * @returns whether CRater is set to score on change
   */
  isCRaterScoreOnChange() {
    let result = false;

    if (this.CRaterService.isCRaterScoreOnChange(this.componentContent)) {
      result = true;
    }

    return result;
  }

  /**
   * Check if CRater is set to score when the student exits the step
   * @returns whether CRater is set to score when the student exits the step
   */
  isCRaterScoreOnExit() {
    let result = false;

    if (this.CRaterService.isCRaterScoreOnExit(this.componentContent)) {
      result = true;
    }

    return result;
  }

  /**
   * Create a component state with the merged student responses
   * @param componentStates an array of component states
   * @return a component state with the merged student responses
   */
  createMergedComponentState(componentStates) {
    // create a new component state
    let mergedComponentState: any = this.NodeService.createNewComponentState();

    if (componentStates != null) {
      let mergedResponse = '';

      // loop through all the component state
      for (let c = 0; c < componentStates.length; c++) {
        let componentState = componentStates[c];

        if (componentState != null) {
          let studentData = componentState.studentData;

          if (studentData != null) {
            // get the student response
            let response = studentData.response;

            if (response != null && response != '') {
              if (mergedResponse != '') {
                // add a new line between the responses
                mergedResponse += '\n';
              }

              // append the response
              mergedResponse += response;
            }
          }
        }
      }

      if (mergedResponse != null && mergedResponse != '') {
        // set the merged response into the merged component state
        mergedComponentState.studentData = {};
        mergedComponentState.studentData.response = mergedResponse;
      }
    }

    return mergedComponentState;
  }

  studentDataChanged() {
    this.setIsDirtyAndBroadcast();
    if (this.studentResponse === '') {
      this.setIsSubmitDirty(false);
    } else {
      this.setIsSubmitDirtyAndBroadcast();
    }
    this.clearSaveText();
    const action = 'change';
    this.createComponentStateAndBroadcast(action);
  }

  startRecordingAudio() {
    if (this.hasAudioResponses()) {
      if (confirm($localize`This will replace your existing recording. Is this OK?`)) {
        this.removeAudioAttachments();
      } else {
        return;
      }
    }
    this.AudioRecorderService.startRecording(`${this.nodeId}-${this.componentId}`);
    this.startAudioCountdown();
    this.isRecordingAudio = true;
  }

  startAudioCountdown() {
    this.audioRecordingStartTime = new Date().getTime();
    this.audioRecordingInterval = setInterval(() => {
      if (this.getAudioRecordingTimeLeft() <= 0) {
        this.stopRecordingAudio();
      }
    }, 500);
  }

  stopRecordingAudio() {
    this.AudioRecorderService.stopRecording();
    this.isRecordingAudio = false;
    clearInterval(this.audioRecordingInterval);
  }

  getAudioRecordingTimeElapsed() {
    const now = new Date().getTime();
    return now - this.audioRecordingStartTime;
  }

  getAudioRecordingTimeLeft() {
    return Math.floor((this.audioRecordingMaxTime - this.getAudioRecordingTimeElapsed()) / 1000);
  }

  hasAudioResponses() {
    return (
      this.attachments.filter((attachment) => {
        return attachment.type === 'audio';
      }).length > 0
    );
  }

  removeAudioAttachment(attachment) {
    if (confirm($localize`Are you sure you want to delete your recording?`)) {
      this.removeAttachment(attachment);
    }
  }

  removeAudioAttachments() {
    this.attachments.forEach((attachment) => {
      if (attachment.type === 'audio') {
        this.removeAttachment(attachment);
      }
    });
  }

  registerAudioRecordedListener() {
    this.subscriptions.add(
      this.AudioRecorderService.audioRecorded$.subscribe(({ requester, audioFile }) => {
        if (requester === `${this.nodeId}-${this.componentId}`) {
          this.StudentAssetService.uploadAsset(audioFile).then((studentAsset) => {
            this.attachStudentAsset(studentAsset).then(() => {
              this.StudentAssetService.deleteAsset(studentAsset);
            });
          });
        }
      })
    );
  }

  mergeObjects(destination: any, source: any): void {
    Object.keys(source).forEach((key) => {
      destination[key] = source[key];
    });
  }
}
