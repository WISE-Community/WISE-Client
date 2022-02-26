import { Component } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentStudent } from '../../component-student.component';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentService } from '../../componentService';
import { DialogResponse } from '../DialogResponse';
import { StudentDialogResponse } from '../StudentDialogResponse';
import { CRaterService } from '../../../services/cRaterService';
import { timeout } from 'rxjs/operators';
import { CRaterResponse } from '../CRaterResponse';
import { ComputerDialogResponse } from '../ComputerDialogResponse';
import { FeedbackRule } from '../FeedbackRule';
import { DialogGuidanceFeedbackRuleEvaluator } from '../DialogGuidanceFeedbackRuleEvaluator';
import { ComputerDialogResponseMultipleScores } from '../ComputerDialogResponseMultipleScores';
import { ComputerDialogResponseSingleScore } from '../ComputerDialogResponseSingleScore';
import { MatDialog } from '@angular/material/dialog';
import { ComputerAvatar } from '../../../common/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { StudentStudentStatusService } from '../../../services/studentStudentStatusService';

@Component({
  selector: 'dialog-guidance-student',
  templateUrl: './dialog-guidance-student.component.html',
  styleUrls: ['./dialog-guidance-student.component.scss']
})
export class DialogGuidanceStudentComponent extends ComponentStudent {
  computerAvatar: ComputerAvatar;
  cRaterTimeout: number = 40000;
  feedbackRuleEvaluator: DialogGuidanceFeedbackRuleEvaluator;
  isShowComputerAvatarSelector: boolean = false;
  isSubmitEnabled: boolean = false;
  isWaitingForComputerResponse: boolean = false;
  responses: DialogResponse[] = [];
  studentCanRespond: boolean = true;
  studentResponse: string;
  workgroupId: number;

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected computerAvatarService: ComputerAvatarService,
    protected ConfigService: ConfigService,
    protected CRaterService: CRaterService,
    protected dialog: MatDialog,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected studentStudentStatusService: StudentStudentStatusService,
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
    if (this.componentState != null) {
      this.responses = this.UtilService.makeCopyOfJSONObject(
        this.componentState.studentData.responses
      );
      this.submitCounter = this.componentState.studentData.submitCounter;
    }
    this.workgroupId = this.ConfigService.getWorkgroupId();
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.disableStudentResponse();
    }
    this.feedbackRuleEvaluator = new DialogGuidanceFeedbackRuleEvaluator(this);
    if (this.componentContent.isComputerAvatarEnabled) {
      this.initializeComputerAvatar();
    } else {
      this.computerAvatar = this.computerAvatarService.getDefaultAvatar();
    }
  }

  initializeComputerAvatar(): void {
    this.tryToRepopulateComputerAvatar();
    if (this.hasStudentPreviouslyChosenComputerAvatar()) {
      this.hideComputerAvatarSelector();
    } else if (this.isOnlyOneComputerAvatarAvailable() && !this.isComputerAvatarPromptAvailable()) {
      this.hideComputerAvatarSelector();
      this.selectComputerAvatar(this.getTheOnlyComputerAvatarAvailable());
    } else {
      this.showComputerAvatarSelector();
    }
  }

  tryToRepopulateComputerAvatar(): void {
    if (this.isComputerAvatarInComponentState(this.componentState)) {
      this.repopulateComputerAvatarFromComponentState(this.componentState);
    } else if (this.shouldUseGlobalComputerAvatar() && this.isGlobalComputerAvatarAvailable()) {
      this.repopulateGlobalComputerAvatar();
    }
  }

  isComputerAvatarInComponentState(componentState: any): boolean {
    return componentState?.studentData?.computerAvatarId != null;
  }

  shouldUseGlobalComputerAvatar(): boolean {
    return this.componentContent.computerAvatarSettings.useGlobalComputerAvatar;
  }

  isGlobalComputerAvatarAvailable(): boolean {
    return this.studentStudentStatusService.getComputerAvatarId() != null;
  }

  repopulateComputerAvatarFromComponentState(componentState: any): void {
    this.computerAvatar = this.computerAvatarService.getAvatar(
      componentState?.studentData?.computerAvatarId
    );
  }

  repopulateGlobalComputerAvatar(): void {
    const computerAvatarId = this.studentStudentStatusService.getComputerAvatarId();
    if (computerAvatarId != null) {
      this.selectComputerAvatar(this.computerAvatarService.getAvatar(computerAvatarId));
    }
  }

  hasStudentPreviouslyChosenComputerAvatar(): boolean {
    return this.computerAvatar != null;
  }

  isOnlyOneComputerAvatarAvailable(): boolean {
    return this.componentContent.computerAvatarSettings.ids.length === 1;
  }

  getTheOnlyComputerAvatarAvailable(): ComputerAvatar {
    return this.computerAvatarService.getAvatar(
      this.componentContent.computerAvatarSettings.ids[0]
    );
  }

  isComputerAvatarPromptAvailable(): boolean {
    const computerAvatarPrompt = this.componentContent.computerAvatarSettings.prompt;
    return computerAvatarPrompt != null && computerAvatarPrompt !== '';
  }

  showComputerAvatarSelector(): void {
    this.isShowComputerAvatarSelector = true;
  }

  hideComputerAvatarSelector(): void {
    this.isShowComputerAvatarSelector = false;
  }

  selectComputerAvatar(computerAvatar: ComputerAvatar): void {
    this.computerAvatar = computerAvatar;
    if (this.shouldUseGlobalComputerAvatar()) {
      this.studentStudentStatusService.setComputerAvatarId(computerAvatar.id);
    }
    this.hideComputerAvatarSelector();
    const computerAvatarInitialResponse = this.componentContent.computerAvatarSettings
      .initialResponse;
    if (computerAvatarInitialResponse != null && computerAvatarInitialResponse !== '') {
      this.addDialogResponse(
        new ComputerDialogResponse(computerAvatarInitialResponse, [], new Date().getTime())
      );
    }
  }

  submitStudentResponse(): void {
    this.disableInput();
    const response = this.studentResponse;
    this.addStudentDialogResponse(response);
    this.clearStudentResponse();
    setTimeout(() => {
      this.submitToCRater(response);
      this.studentDataChanged();
    }, 500);
  }

  clearStudentResponse(): void {
    this.studentResponse = '';
    this.studentResponseChanged();
  }

  addStudentDialogResponse(text: string): void {
    this.responses.push(new StudentDialogResponse(text, new Date().getTime(), this.workgroupId));
  }

  addDialogResponse(dialogResponse: DialogResponse): void {
    this.responses.push(dialogResponse);
  }

  submitToCRater(studentResponse: string): void {
    this.showWaitingForComputerResponse();
    this.CRaterService.makeCRaterScoringRequest(
      this.componentContent.itemId,
      new Date().getTime(),
      studentResponse
    )
      .pipe(timeout(this.cRaterTimeout))
      .subscribe(
        (response: CRaterResponse) => {
          this.cRaterSuccessResponse(Object.assign(new CRaterResponse(), response));
        },
        () => {
          this.cRaterErrorResponse();
        }
      );
  }

  showWaitingForComputerResponse(): void {
    this.isWaitingForComputerResponse = true;
  }

  hideWaitingForComputerResponse(): void {
    this.isWaitingForComputerResponse = false;
  }

  disableInput(): void {
    this.isDisabled = true;
  }

  enableInput(): void {
    this.isDisabled = false;
  }

  disableStudentResponse(): void {
    this.studentCanRespond = false;
  }

  cRaterSuccessResponse(response: CRaterResponse): void {
    this.hideWaitingForComputerResponse();
    this.submitButtonClicked();
    this.addDialogResponse(this.createComputerDialogResponse(response));
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.disableStudentResponse();
    } else {
      this.enableInput();
    }
  }

  createComputerDialogResponse(response: CRaterResponse): ComputerDialogResponse {
    const feedbackRule: FeedbackRule = this.feedbackRuleEvaluator.getFeedbackRule(response);
    return response.scores != null
      ? new ComputerDialogResponseMultipleScores(
          feedbackRule.feedback,
          response.scores,
          response.ideas,
          new Date().getTime()
        )
      : new ComputerDialogResponseSingleScore(
          feedbackRule.feedback,
          response.score,
          response.ideas,
          new Date().getTime()
        );
  }

  cRaterErrorResponse() {
    this.hideWaitingForComputerResponse();
    this.enableInput();
    this.saveButtonClicked();
  }

  createComponentState(action: string): Promise<any> {
    const componentState: any = this.NodeService.createNewComponentState();
    componentState.studentData = {
      responses: this.responses,
      submitCounter: this.submitCounter
    };
    if (this.computerAvatar != null) {
      componentState.studentData.computerAvatarId = this.computerAvatar.id;
    }
    componentState.componentType = 'DialogGuidance';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.componentId;
    componentState.isSubmit = action === 'submit';
    const promise = new Promise((resolve, reject) => {
      this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
    return promise;
  }

  studentResponseChanged(): void {
    this.isSubmitEnabled = this.studentResponse.length > 0;
    this.setIsSubmitDirty(this.isSubmitDirty || this.isSubmitEnabled);
  }
}
