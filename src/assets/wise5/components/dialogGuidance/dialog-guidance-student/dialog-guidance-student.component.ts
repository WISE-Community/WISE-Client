import { Component } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
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
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { StudentStatusService } from '../../../services/studentStatusService';
import { DialogGuidanceFeedbackService } from '../../../services/dialogGuidanceFeedbackService';
import { FeedbackRuleComponent } from '../../feedbackRule/FeedbackRuleComponent';
import { ComponentStudent } from '../../component-student.component';
import { DialogGuidanceComponent } from '../DialogGuidanceComponent';
import { copy } from '../../../common/object/object';
import { RawCRaterResponse } from '../../common/cRater/RawCRaterResponse';
import { ConstraintService } from '../../../services/constraintService';
import { applyMixins } from '../../../common/apply-mixins';
import { ComputerAvatarInitializer } from '../../../common/computer-avatar/computer-avatar-initializer';

@Component({
  selector: 'dialog-guidance-student',
  templateUrl: './dialog-guidance-student.component.html',
  styleUrls: ['./dialog-guidance-student.component.scss']
})
export class DialogGuidanceStudentComponent extends ComponentStudent {
  component: DialogGuidanceComponent;
  computerAvatar: ComputerAvatar;
  protected computerAvatarSelectorVisible: boolean = false;
  cRaterTimeout: number = 40000;
  feedbackRuleEvaluator: FeedbackRuleEvaluator<CRaterResponse[]>;
  isWaitingForComputerResponse: boolean = false;
  responses: DialogResponse[] = [];
  studentCanRespond: boolean = true;
  workgroupId: number;

  constructor(
    protected annotationService: AnnotationService,
    protected componentService: ComponentService,
    protected computerAvatarService: ComputerAvatarService,
    protected configService: ConfigService,
    private constraintService: ConstraintService,
    protected cRaterService: CRaterService,
    protected dialog: MatDialog,
    protected dialogGuidanceFeedbackService: DialogGuidanceFeedbackService,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    protected studentAssetService: StudentAssetService,
    protected dataService: StudentDataService,
    protected studentStatusService: StudentStatusService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      studentAssetService,
      dataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.componentState != null) {
      this.responses = copy(this.componentState.studentData.responses);
      this.submitCounter = this.componentState.studentData.submitCounter;
    }
    this.workgroupId = this.configService.getWorkgroupId();
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.disableStudentResponse();
    }
    this.feedbackRuleEvaluator = new FeedbackRuleEvaluator(
      new FeedbackRuleComponent(
        this.component.getFeedbackRules(),
        this.getMaxSubmitCount(),
        this.component.isMultipleFeedbackTextsForSameRuleAllowed()
      ),
      this.configService,
      this.constraintService
    );
    this.initializeComputerAvatar();
  }

  showInitialMessage(): void {
    this.addDialogResponse(
      new ComputerDialogResponse(
        this.component.getComputerAvatarInitialResponse(),
        [],
        new Date().getTime(),
        true
      )
    );
  }

  protected submitStudentResponse(response: string): void {
    this.addStudentDialogResponse(response);
    this.submitToCRater(response);
    this.studentDataChanged();
  }

  private addStudentDialogResponse(text: string): void {
    this.responses.push(new StudentDialogResponse(text, new Date().getTime(), this.workgroupId));
  }

  private addDialogResponse(dialogResponse: DialogResponse): void {
    this.responses.push(dialogResponse);
  }

  private submitToCRater(studentResponse: string): void {
    this.showWaitingForComputerResponse();
    this.cRaterService
      .makeCRaterScoringRequest(this.component.getItemId(), new Date().getTime(), studentResponse)
      .pipe(timeout(this.cRaterTimeout))
      .subscribe(
        (response: any) => {
          this.cRaterSuccessResponse(response.responses);
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

  private disableStudentResponse(): void {
    this.studentCanRespond = false;
  }

  cRaterSuccessResponse(responses: RawCRaterResponse): void {
    this.hideWaitingForComputerResponse();
    this.submitButtonClicked();
    const cRaterResponse = this.cRaterService.getCRaterResponse(responses, this.submitCounter);
    this.addDialogResponse(this.createComputerDialogResponse(cRaterResponse));
    if (this.hasMaxSubmitCountAndUsedAllSubmits()) {
      this.disableStudentResponse();
    }
  }

  createComputerDialogResponse(response: CRaterResponse): ComputerDialogResponse {
    const allCRaterResponses = this.getCRaterResponses().concat(response);
    const rule: FeedbackRule = this.feedbackRuleEvaluator.getFeedbackRule(allCRaterResponses);
    const feedbackText = this.dialogGuidanceFeedbackService.getFeedbackText(this.component, rule);
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
    if (this.component.isVersion2()) {
      computerResponse.feedbackRuleId = rule.id;
    }
    return computerResponse;
  }

  private getCRaterResponses(): CRaterResponse[] {
    let submitCounter = 1;
    return (
      this.dataService
        .getLatestComponentStateByNodeIdAndComponentId(this.nodeId, this.componentId)
        ?.studentData.responses.filter(
          (response: DialogResponse) =>
            response.user === 'Computer' && !(response as ComputerDialogResponse).initialResponse
        )
        .map((response: DialogResponse) => {
          const cRaterResponse = new CRaterResponse(response);
          cRaterResponse.submitCounter = submitCounter++;
          return cRaterResponse;
        }) ?? []
    );
  }

  cRaterErrorResponse() {
    this.hideWaitingForComputerResponse();
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

  initializeComputerAvatar: () => void;
  selectComputerAvatar: (computerAvatar: ComputerAvatar) => void;
}

applyMixins(DialogGuidanceStudentComponent, [ComputerAvatarInitializer]);
