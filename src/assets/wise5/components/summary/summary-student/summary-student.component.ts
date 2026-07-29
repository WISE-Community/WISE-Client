import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
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
import { StudentSummaryDisplay } from '../../../directives/student-summary-display/student-summary-display.component';

@Component({
  imports: [
    ComponentHeaderComponent,StudentSummaryDisplay],
  styles: ['.prompt { font-weight: 500; padding-bottom: 8px; }'],
  templateUrl: 'summary-student.component.html'
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
    protected annotationService: AnnotationService,
    private completionService: CompletionService,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected dialog: MatDialog,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
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
    this.isStudent = this.configService.isPreview() || this.configService.isStudentRun();
    if (this.isStudent) {
      this.isShowDisplay = this.calculateIsShowDisplay();
    } else {
      this.isShowDisplay = !this.configService.isAuthoring();
    }
    this.otherStepTitle = this.getOtherStepTitle();
    if (!this.isShowDisplay) {
      this.warningMessage = this.getWarningMessage();
    }
    this.setPeriodIdIfNecessary();
  }

  getOtherPrompt(nodeId, componentId) {
    const otherComponent = this.projectService.getComponent(nodeId, componentId);
    if (otherComponent != null) {
      return otherComponent.prompt;
    }
    return null;
  }

  isStudentHasWork() {
    const componentStates = this.studentDataService.getComponentStatesByNodeIdAndComponentId(
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
    const componentStates = this.studentDataService.getComponentStatesByNodeIdAndComponentId(
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
    const componentStates = this.studentDataService.getComponentStatesByNodeIdAndComponentId(
      this.summaryNodeId,
      this.summaryComponentId
    );
    return componentStates.length > 0;
  }

  studentHasCompletedComponent() {
    return this.completionService.isCompleted(this.summaryNodeId, this.summaryComponentId);
  }

  getOtherStepTitle() {
    return this.projectService.getNodePositionAndTitle(this.summaryNodeId);
  }

  setPeriodIdIfNecessary() {
    if (this.configService.isStudentRun()) {
      if (this.source === 'period' && this.periodId == null) {
        this.periodId = this.configService.getPeriodId();
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
