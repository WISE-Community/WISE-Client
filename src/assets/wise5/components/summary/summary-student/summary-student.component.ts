import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';
import { CompletionService } from '../../../services/completionService';

@Component({
  selector: 'summary-student',
  templateUrl: 'summary-student.component.html',
  styleUrls: ['summary-student.component.scss']
})
export class SummaryStudent extends ComponentStudent {
  chartType: string;
  customLabelColors: any[];
  highlightCorrectAnswer: boolean;
  isShowDisplay: boolean;
  isStudent: boolean;
  otherPrompt: string;
  otherStepTitle: string;
  @Input() periodId: number;
  prompt: string;
  source: string;
  studentDataType: string;
  summaryNodeId: string;
  summaryComponentId: string;
  warningMessage: string = '';

  constructor(
    protected AnnotationService: AnnotationService,
    private completionService: CompletionService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    private ProjectService: ProjectService,
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
    this.summaryNodeId = this.componentContent.summaryNodeId;
    this.summaryComponentId = this.componentContent.summaryComponentId;
    this.studentDataType = this.componentContent.studentDataType;
    this.chartType = this.componentContent.chartType;
    this.prompt = this.componentContent.prompt;
    this.highlightCorrectAnswer = this.componentContent.highlightCorrectAnswer;
    this.source = this.componentContent.source;
    this.customLabelColors = this.componentContent.customLabelColors;
    if (this.componentContent.showPromptFromOtherComponent) {
      this.otherPrompt = this.getOtherPrompt(this.summaryNodeId, this.summaryComponentId);
    }
    this.isStudent = this.ConfigService.isPreview() || this.ConfigService.isStudentRun();
    if (this.isStudent) {
      this.otherStepTitle = this.getOtherStepTitle();
      this.isShowDisplay = this.calculateIsShowDisplay();
    } else {
      this.isShowDisplay = true;
    }
    if (!this.isShowDisplay) {
      this.warningMessage = this.getWarningMessage();
    }
    this.setPeriodIdIfNecessary();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  getOtherPrompt(nodeId, componentId) {
    const otherComponent = this.ProjectService.getComponent(nodeId, componentId);
    if (otherComponent != null) {
      return otherComponent.prompt;
    }
    return null;
  }

  isStudentHasWork() {
    const componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
      this.summaryNodeId,
      this.summaryComponentId
    );
    return componentStates.length > 0;
  }

  calculateIsShowDisplay() {
    if (this.isRequirementToSeeSummarySubmitWork()) {
      return this.studentHasSubmittedWork();
    } else if (this.isRequirementToSeeSummaryCompleteComponent()) {
      return this.studentHasCompletedComponent();
    } else if (this.isRequirementToSeeSummaryNone()) {
      return true;
    }
  }

  getWarningMessage() {
    if (this.isSourceSelf()) {
      return this.getWarningMessageForSourceSelf();
    } else if (this.isSourcePeriod() || this.isSourceAllPeriods()) {
      return this.getWarningMessageForSourceClass();
    }
  }

  isSourceSelf() {
    return this.source === 'self';
  }

  isSourcePeriod() {
    return this.source === 'period';
  }

  isSourceAllPeriods() {
    return this.source === 'allPeriods';
  }

  getWarningMessageForSourceSelf() {
    if (this.isRequirementToSeeSummarySubmitWork()) {
      return $localize`You must submit work on "${this.otherStepTitle}" to view the summary.`;
    } else if (this.isRequirementToSeeSummaryCompleteComponent()) {
      return $localize`You must complete "${this.otherStepTitle}" to view the summary.`;
    }
  }

  getWarningMessageForSourceClass() {
    if (this.isRequirementToSeeSummarySubmitWork()) {
      return $localize`You must submit work on "${this.otherStepTitle}" to view the class summary.`;
    } else if (this.isRequirementToSeeSummaryCompleteComponent()) {
      return $localize`You must complete "${this.otherStepTitle}" to view the class summary.`;
    }
  }

  isRequirementToSeeSummarySubmitWork() {
    return this.componentContent.requirementToSeeSummary === 'submitWork';
  }

  isRequirementToSeeSummaryCompleteComponent() {
    return this.componentContent.requirementToSeeSummary === 'completeComponent';
  }

  isRequirementToSeeSummaryNone() {
    return this.componentContent.requirementToSeeSummary === 'none';
  }

  studentHasSubmittedWork() {
    const componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
      this.summaryNodeId,
      this.summaryComponentId
    );
    for (const componentState of componentStates) {
      if (componentState.isSubmit) {
        return true;
      }
    }
    return false;
  }

  studentHasSavedWork() {
    const componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(
      this.summaryNodeId,
      this.summaryComponentId
    );
    return componentStates.length > 0;
  }

  studentHasCompletedComponent() {
    return this.completionService.isCompleted(this.summaryNodeId, this.summaryComponentId);
  }

  getOtherStepTitle() {
    return this.ProjectService.getNodePositionAndTitle(this.summaryNodeId);
  }

  setPeriodIdIfNecessary() {
    if (this.ConfigService.isStudentRun()) {
      if (this.source === 'period' && this.periodId == null) {
        this.periodId = this.ConfigService.getPeriodId();
      } else if (this.source === 'allPeriods') {
        this.periodId = null;
      }
    }
  }

  handleStudentWorkSavedToServerAdditionalProcessing(componentState: any) {
    if (this.isStudent) {
      this.isShowDisplay = this.calculateIsShowDisplay();
    }
  }
}
