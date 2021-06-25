import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { HtmlDialog } from '../../../directives/html-dialog/html-dialog';
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
  isPublicSpaceExist: boolean = false;
  isRecordingAudio: boolean = false;
  isRichTextEnabled: boolean = false;
  isStudentAudioRecordingEnabled: boolean = false;
  messageDialog: any;
  studentResponse: string = '';
  tinymceOptions: any;

  constructor(
    protected AnnotationService: AnnotationService,
    private AudioRecorderService: AudioRecorderService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    private CRaterService: CRaterService,
    private dialog: MatDialog,
    private OpenResponseService: OpenResponseService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private NotificationService: NotificationService,
    private ProjectService: ProjectService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected upgrade: UpgradeModule,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService,
      upgrade,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();

    let themePath = this.ProjectService.getThemePath();

    // TODO: make toolbar items and plugins customizable by authors (OR strip down to only special characters, support for equations)
    // Rich text editor options
    this.tinymceOptions = {
      //onChange: function(e) {
      //scope.studentDataChanged();
      //},
      menubar: false,
      plugins: 'link image media autoresize', //imagetools
      toolbar:
        'undo redo | bold italic | superscript subscript | bullist numlist | alignleft aligncenter alignright | link image media',
      autoresize_bottom_margin: '0',
      autoresize_min_height: '100',
      image_advtab: true,
      content_css: themePath + '/style/tinymce.css',
      setup: function (ed) {
        ed.on('focus', function (e) {
          $(e.target.editorContainer)
            .addClass('input--focused')
            .parent()
            .addClass('input-wrapper--focused');
          $('label[for="' + e.target.id + '"]').addClass('input-label--focused');
        });

        ed.on('blur', function (e) {
          $(e.target.editorContainer)
            .removeClass('input--focused')
            .parent()
            .removeClass('input-wrapper--focused');
          $('label[for="' + e.target.id + '"]').removeClass('input-label--focused');
        });
      }
    };

    if (this.mode === 'student') {
      this.isSaveButtonVisible = this.componentContent.showSaveButton;
      this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
    } else if (this.mode === 'showPreviousWork') {
      this.isSaveButtonVisible = false;
      this.isSubmitButtonVisible = false;
      this.isDisabled = true;
    }

    // set whether rich text is enabled
    this.isRichTextEnabled = this.componentContent.isRichTextEnabled;

    if (this.mode == 'student') {
      if (this.UtilService.hasShowWorkConnectedComponent(this.componentContent)) {
        // we will show work from another component
        this.handleConnectedComponents();
      } else if (
        this.componentState != null &&
        this.OpenResponseService.componentStateHasStudentWork(
          this.componentState,
          this.componentContent
        )
      ) {
        /*
         * the student has work so we will populate the work into this
         * component
         */
        this.setStudentWork(this.componentState);
      } else if (this.UtilService.hasConnectedComponent(this.componentContent)) {
        // we will import work from another component
        this.handleConnectedComponents();
      } else if (this.componentState == null) {
        // check if we need to import work

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
    } else {
      // populate the student work into this component
      this.setStudentWork(this.componentState);
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

    componentState.isCompleted = this.OpenResponseService.isCompleted(
      this.componentContent,
      [componentState],
      null,
      null,
      this.ProjectService.getNodeById(this.nodeId)
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
    let performCRaterScoring = false;

    // determine if we need to perform CRater scoring
    if (action == 'submit' && componentState.isSubmit) {
      if (this.isCRaterScoreOnSubmit()) {
        performCRaterScoring = true;
      }
    } else if (action == 'save') {
      if (this.isCRaterScoreOnSave()) {
        performCRaterScoring = true;
      }
    } else if (action == 'change' || action == null) {
      if (this.isCRaterScoreOnChange()) {
        performCRaterScoring = true;
      }
    }

    if (performCRaterScoring) {
      const cRaterItemId = this.CRaterService.getCRaterItemId(this.componentContent);
      const cRaterResponseId = new Date().getTime();
      const studentData = this.studentResponse;
      const dialogRef = this.dialog.open(HtmlDialog, {
        data: {
          content: $localize`Please wait, we are scoring your work.`,
          isShowCloseButton: false,
          title: $localize`Please Wait`
        }
      });

      // make the CRater request to score the student data
      this.CRaterService.makeCRaterScoringRequest(cRaterItemId, cRaterResponseId, studentData).then(
        (data: any) => {
          /*
           * annotations we put in the component state will be
           * removed from the component state and saved separately
           */
          componentState.annotations = [];

          // get the CRater score
          let score = data.score;
          let concepts = data.concepts;
          let previousScore = null;
          if (data.scores != null) {
            const maxSoFarFunc = (accumulator, currentValue) => {
              return Math.max(accumulator, currentValue.score);
            };
            score = data.scores.reduce(maxSoFarFunc, 0);
          }

          if (score != null) {
            const autoScoreAnnotationData: any = {
              value: score,
              maxAutoScore: this.ProjectService.getMaxScoreForComponent(
                this.nodeId,
                this.componentId
              ),
              concepts: concepts,
              autoGrader: 'cRater'
            };
            if (data.scores != null) {
              autoScoreAnnotationData.scores = data.scores;
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

            if (
              this.componentContent.enableGlobalAnnotations &&
              this.componentContent.globalAnnotationSettings != null
            ) {
              let globalAnnotationMaxCount = 0;
              if (this.componentContent.globalAnnotationSettings.globalAnnotationMaxCount != null) {
                globalAnnotationMaxCount = this.componentContent.globalAnnotationSettings
                  .globalAnnotationMaxCount;
              }
              // get the annotation properties for the score that the student got.
              annotationGroupForScore = this.ProjectService.getGlobalAnnotationGroupByScore(
                this.componentContent,
                previousScore,
                score
              );

              // check if we need to apply this globalAnnotationSetting to this annotation: we don't need to if we've already reached the maxCount
              if (annotationGroupForScore != null) {
                let globalAnnotationGroupsByNodeIdAndComponentId = this.AnnotationService.getAllGlobalAnnotationGroups();
                annotationGroupForScore.annotationGroupCreatedTime =
                  autoScoreAnnotation.clientSaveTime; // save annotation creation time

                if (
                  globalAnnotationGroupsByNodeIdAndComponentId.length >= globalAnnotationMaxCount
                ) {
                  // we've already applied this annotation properties to maxCount annotations, so we don't need to apply it any more.
                  annotationGroupForScore = null;
                }
              }

              if (
                annotationGroupForScore != null &&
                annotationGroupForScore.isGlobal &&
                annotationGroupForScore.unGlobalizeCriteria != null
              ) {
                // check if this annotation is global and what criteria needs to be met to un-globalize.
                annotationGroupForScore.unGlobalizeCriteria.map((unGlobalizeCriteria) => {
                  // if the un-globalize criteria is time-based (e.g. isVisitedAfter, isRevisedAfter, isVisitedAndRevisedAfter, etc), store the timestamp of this annotation in the criteria
                  // so we can compare it when we check for criteria satisfaction.
                  if (unGlobalizeCriteria.params != null) {
                    unGlobalizeCriteria.params.criteriaCreatedTimestamp =
                      autoScoreAnnotation.clientSaveTime; // save annotation creation time to criteria
                  }
                });
              }

              if (annotationGroupForScore != null) {
                // copy over the annotation properties into the autoScoreAnnotation's data
                this.mergeObjects(
                  autoScoreAnnotation.data,
                  this.UtilService.makeCopyOfJSONObject(annotationGroupForScore)
                );
              }
            }

            componentState.annotations.push(autoScoreAnnotation);

            if (this.mode === 'authoring') {
              if (this.latestAnnotations == null) {
                this.latestAnnotations = {};
              }

              /*
               * we are in the authoring view so we will set the
               * latest score annotation manually
               */
              this.latestAnnotations.score = autoScoreAnnotation;
            }

            let autoComment = null;

            // get the submit counter
            const submitCounter = this.submitCounter;

            if (
              this.componentContent.cRater.enableMultipleAttemptScoringRules &&
              submitCounter > 1
            ) {
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
              // get the feedback text
              autoComment = this.CRaterService.getCRaterFeedbackTextByScore(
                this.componentContent,
                score
              );
            }

            if (autoComment != null) {
              // create the auto comment annotation
              const autoCommentAnnotationData: any = {};
              autoCommentAnnotationData.value = autoComment;
              autoCommentAnnotationData.concepts = concepts;
              autoCommentAnnotationData.autoGrader = 'cRater';

              const autoCommentAnnotation = this.createAutoCommentAnnotation(
                autoCommentAnnotationData
              );

              if (this.componentContent.enableGlobalAnnotations) {
                if (annotationGroupForScore != null) {
                  // copy over the annotation properties into the autoCommentAnnotation's data
                  this.mergeObjects(
                    autoScoreAnnotation.data,
                    this.UtilService.makeCopyOfJSONObject(annotationGroupForScore)
                  );
                }
              }
              componentState.annotations.push(autoCommentAnnotation);

              if (this.mode === 'authoring') {
                if (this.latestAnnotations == null) {
                  this.latestAnnotations = {};
                }

                /*
                 * we are in the authoring view so we will set the
                 * latest comment annotation manually
                 */
                this.latestAnnotations.comment = autoCommentAnnotation;
              }
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

            if (
              this.componentContent.enableGlobalAnnotations &&
              annotationGroupForScore != null &&
              annotationGroupForScore.isGlobal &&
              annotationGroupForScore.isPopup
            ) {
              this.AnnotationService.broadcastDisplayGlobalAnnotations();
            }
          }

          dialogRef.close();

          // resolve the promise now that we are done performing additional processing
          deferred.resolve(componentState);
        }
      );
    } else if (
      this.ProjectService.hasAdditionalProcessingFunctions(this.nodeId, this.componentId)
    ) {
      // if there are any additionalProcessingFunctions for this node and component, call all of them
      let additionalProcessingFunctions = this.ProjectService.getAdditionalProcessingFunctions(
        this.nodeId,
        this.componentId
      );
      let allPromises = [];
      for (let i = 0; i < additionalProcessingFunctions.length; i++) {
        let additionalProcessingFunction = additionalProcessingFunctions[i];
        const promise = new Promise((resolve, reject) => {
          additionalProcessingFunction(
            { resolve: resolve, reject: reject },
            componentState,
            action
          );
        });
        allPromises.push(promise);
      }
      Promise.all(allPromises).then(() => {
        deferred.resolve(componentState);
      });
    } else {
      if (this.isSubmit && this.hasDefaultFeedback()) {
        this.addDefaultFeedback(componentState);
      }
      /*
       * we don't need to perform any additional processing so we can resolve
       * the promise immediately
       */
      deferred.resolve(componentState);
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

  /**
   * Get the number of rows for the textarea
   */
  getNumRows() {
    let numRows = null;

    if (this.componentContent != null) {
      numRows = this.componentContent.numRows;
    }

    return numRows;
  }

  /**
   * Get the number of columns for the textarea
   */
  getNumColumns() {
    let numColumns = null;

    if (this.componentContent != null) {
      numColumns = this.componentContent.numColumns;
    }

    return numColumns;
  }

  /**
   * Get the text the student typed
   */
  getResponse() {
    let response = null;

    if (this.studentResponse != null) {
      response = this.studentResponse;
    }

    return response;
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
