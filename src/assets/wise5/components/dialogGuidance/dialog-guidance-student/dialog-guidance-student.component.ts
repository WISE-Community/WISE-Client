import { Component } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
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
import { CRaterResponse } from '../../common/cRater/CRaterResponse';
import { ComputerDialogResponse } from '../ComputerDialogResponse';
import { FeedbackRule } from '../../common/feedbackRule/FeedbackRule';
import { FeedbackRuleEvaluator } from '../../common/feedbackRule/FeedbackRuleEvaluator';
import { ComputerDialogResponseMultipleScores } from '../ComputerDialogResponseMultipleScores';
import { ComputerDialogResponseSingleScore } from '../ComputerDialogResponseSingleScore';
import { MatDialog } from '@angular/material/dialog';
import { ComputerAvatar } from '../../../common/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { StudentStatusService } from '../../../services/studentStatusService';
import { DialogGuidanceFeedbackService } from '../../../services/dialogGuidanceFeedbackService';
import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';
import { ComponentStudent } from '../../component-student.component';

@Component({
  selector: 'dialog-guidance-student',
  templateUrl: './dialog-guidance-student.component.html',
  styleUrls: ['./dialog-guidance-student.component.scss']
})
export class DialogGuidanceStudentComponent extends ComponentStudent {
  computerAvatar: ComputerAvatar;
  cRaterTimeout: number = 40000;
  feedbackRuleEvaluator: FeedbackRuleEvaluator;
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
    protected dialogGuidanceFeedbackService: DialogGuidanceFeedbackService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected studentStatusService: StudentStatusService,
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
    this.feedbackRuleEvaluator = new FeedbackRuleEvaluator(
      new FeedbackRuleComponent(
        this.getFeedbackRules(),
        this.getMaxSubmitCount(),
        this.isMultipleFeedbackTextsForSameRuleAllowed()
      )
    );
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

  private tryToRepopulateComputerAvatar(): void {
    if (this.includesComputerAvatar(this.componentState)) {
      this.repopulateComputerAvatarFromComponentState(this.componentState);
    } else if (this.isUseGlobalComputerAvatar() && this.isGlobalComputerAvatarAvailable()) {
      this.repopulateGlobalComputerAvatar();
    }
  }

  private includesComputerAvatar(componentState: any): boolean {
    return componentState?.studentData?.computerAvatarId != null;
  }

  private isUseGlobalComputerAvatar(): boolean {
    return this.componentContent.computerAvatarSettings.useGlobalComputerAvatar;
  }

  private isGlobalComputerAvatarAvailable(): boolean {
    return this.studentStatusService.getComputerAvatarId() != null;
  }

  private repopulateComputerAvatarFromComponentState(componentState: any): void {
    this.computerAvatar = this.computerAvatarService.getAvatar(
      componentState?.studentData?.computerAvatarId
    );
  }

  private repopulateGlobalComputerAvatar(): void {
    const computerAvatarId = this.studentStatusService.getComputerAvatarId();
    if (computerAvatarId != null) {
      this.selectComputerAvatar(this.computerAvatarService.getAvatar(computerAvatarId));
    }
  }

  private hasStudentPreviouslyChosenComputerAvatar(): boolean {
    return this.computerAvatar != null;
  }

  private isOnlyOneComputerAvatarAvailable(): boolean {
    return this.componentContent.computerAvatarSettings.ids.length === 1;
  }

  private getTheOnlyComputerAvatarAvailable(): ComputerAvatar {
    return this.computerAvatarService.getAvatar(
      this.componentContent.computerAvatarSettings.ids[0]
    );
  }

  private isComputerAvatarPromptAvailable(): boolean {
    const computerAvatarPrompt = this.componentContent.computerAvatarSettings.prompt;
    return computerAvatarPrompt != null && computerAvatarPrompt !== '';
  }

  private showComputerAvatarSelector(): void {
    this.isShowComputerAvatarSelector = true;
  }

  private hideComputerAvatarSelector(): void {
    this.isShowComputerAvatarSelector = false;
  }

  selectComputerAvatar(computerAvatar: ComputerAvatar): void {
    this.computerAvatar = computerAvatar;
    if (this.isUseGlobalComputerAvatar()) {
      this.studentStatusService.setComputerAvatarId(computerAvatar.id);
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

  private clearStudentResponse(): void {
    this.studentResponse = '';
    this.studentResponseChanged();
  }

  private addStudentDialogResponse(text: string): void {
    this.responses.push(new StudentDialogResponse(text, new Date().getTime(), this.workgroupId));
  }

  private addDialogResponse(dialogResponse: DialogResponse): void {
    this.responses.push(dialogResponse);
  }

  private submitToCRater(studentResponse: string): void {
    this.showWaitingForComputerResponse();
    this.CRaterService.makeCRaterScoringRequest(
      this.componentContent.itemId,
      new Date().getTime(),
      studentResponse
    )
      .pipe(timeout(this.cRaterTimeout))
      .subscribe(
        (response: any) => {
          this.cRaterSuccessResponse(response);
        },
        () => {
          this.cRaterErrorResponse();
        }
      );
  }

  private showWaitingForComputerResponse(): void {
    this.isWaitingForComputerResponse = true;
  }

  private hideWaitingForComputerResponse(): void {
    this.isWaitingForComputerResponse = false;
  }

  private disableInput(): void {
    this.isDisabled = true;
  }

  private enableInput(): void {
    this.isDisabled = false;
  }

  private disableStudentResponse(): void {
    this.studentCanRespond = false;
  }

  cRaterSuccessResponse(response: any): void {
    this.hideWaitingForComputerResponse();
    this.submitButtonClicked();
    const cRaterResponse = this.CRaterService.getCRaterResponse(response, this.submitCounter);
    this.addDialogResponse(this.createComputerDialogResponse(cRaterResponse));
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.disableStudentResponse();
    } else {
      this.enableInput();
    }
  }

  createComputerDialogResponse(response: CRaterResponse): ComputerDialogResponse {
    const feedbackRule: FeedbackRule = this.feedbackRuleEvaluator.getFeedbackRule(response);
    const feedbackText = this.dialogGuidanceFeedbackService.getFeedbackText(this, feedbackRule);
    const computerResponse =
      response.scores != null
        ? new ComputerDialogResponseMultipleScores(
            feedbackText,
            response.scores,
            response.ideas,
            new Date().getTime()
          )
        : new ComputerDialogResponseSingleScore(
            feedbackText,
            response.score,
            response.ideas,
            new Date().getTime()
          );
    if (this.isVersion2()) {
      computerResponse.feedbackRuleId = feedbackRule.id;
    }
    return computerResponse;
  }

  isVersion1(): boolean {
    return this.componentContent.version == null;
  }

  isVersion2(): boolean {
    return this.componentContent.version === 2;
  }

  cRaterErrorResponse() {
    this.hideWaitingForComputerResponse();
    this.enableInput();
    this.saveButtonClicked();
  }

  createComponentState(action: string): Promise<any> {
    const componentState: any = this.createNewComponentState();
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

  getFeedbackRules(): FeedbackRule[] {
    return this.componentContent.feedbackRules;
  }

  isMultipleFeedbackTextsForSameRuleAllowed(): boolean {
    return !this.isVersion1();
  }
}
