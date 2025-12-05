import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';
import { MultipleChoiceContent } from '../../multipleChoice/MultipleChoiceContent';
import { SummaryService } from '../summaryService';

@Component({
  imports: [
    EditComponentPrompt,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatCheckbox,
    MatButton,
    MatTooltip,
    MatIcon,
    TranslatableInputComponent,
    MatInput
  ],
  selector: 'summary-authoring',
  styleUrl: 'summary-authoring.component.scss',
  templateUrl: 'summary-authoring.component.html'
})
export class SummaryAuthoring extends AbstractComponentAuthoring {
  private componentServiceLookupService = inject(ComponentServiceLookupService);
  private summaryService = inject(SummaryService);

  isResponsesOptionAvailable: boolean = false;
  isHighlightCorrectAnswerAvailable: boolean = false;
  isPieChartAllowed: boolean = true;
  stepNodesDetails: string[] = this.projectService.getStepNodesDetailsInOrder();

  ngOnInit(): void {
    super.ngOnInit();
    this.updateStudentDataTypeOptionsIfNecessary();
    this.updateHasCorrectAnswerIfNecessary();
    this.updateChartTypeOptionsIfNecessary();
  }

  summaryNodeIdChanged(): void {
    this.componentContent.summaryComponentId = null;
    const components = this.getComponents(this.componentContent.summaryNodeId);
    const allowedComponents = [];
    for (const component of components) {
      if (this.isComponentTypeAllowed(component.type) && component.id != this.componentId) {
        allowedComponents.push(component);
      }
    }
    if (allowedComponents.length === 1) {
      this.componentContent.summaryComponentId = allowedComponents[0].id;
    }
    this.performUpdatesIfNecessary();
    this.componentChanged();
  }

  isComponentTypeAllowed(componentType: string): boolean {
    return this.summaryService.isComponentTypeAllowed(componentType);
  }

  summaryComponentIdChanged(): void {
    this.performUpdatesIfNecessary();
    this.componentChanged();
  }

  studentDataTypeChanged(): void {
    this.updateHasCorrectAnswerIfNecessary();
    this.updateChartTypeOptionsIfNecessary();
    this.componentChanged();
  }

  performUpdatesIfNecessary(): void {
    this.updateStudentDataTypeOptionsIfNecessary();
    this.updateStudentDataTypeIfNecessary();
    this.updateHasCorrectAnswerIfNecessary();
    this.updateChartTypeOptionsIfNecessary();
  }

  updateStudentDataTypeOptionsIfNecessary(): void {
    const nodeId = this.componentContent.summaryNodeId;
    const componentId = this.componentContent.summaryComponentId;
    this.isResponsesOptionAvailable = this.isStudentDataTypeAvailableForComponent(
      nodeId,
      componentId,
      'responses'
    );
  }

  updateStudentDataTypeIfNecessary(): void {
    const nodeId = this.componentContent.summaryNodeId;
    const componentId = this.componentContent.summaryComponentId;
    const studentDataType = this.componentContent.studentDataType;
    if (!this.isStudentDataTypeAvailableForComponent(nodeId, componentId, studentDataType)) {
      if (this.isStudentDataTypeAvailableForComponent(nodeId, componentId, 'responses')) {
        this.componentContent.studentDataType = 'responses';
      } else if (this.isStudentDataTypeAvailableForComponent(nodeId, componentId, 'scores')) {
        this.componentContent.studentDataType = 'scores';
      } else {
        this.componentContent.studentDataType = null;
      }
    }
  }

  updateHasCorrectAnswerIfNecessary(): void {
    this.isHighlightCorrectAnswerAvailable =
      this.componentHasCorrectAnswer() && this.componentContent.studentDataType === 'responses';
    if (!this.isHighlightCorrectAnswerAvailable) {
      this.componentContent.highlightCorrectAnswer = false;
    }
  }

  updateChartTypeOptionsIfNecessary(): void {
    this.isPieChartAllowed =
      this.componentContent.studentDataType === 'scores' ||
      !this.componentAllowsMultipleResponses();
    if (!this.isPieChartAllowed && this.componentContent.chartType === 'pie') {
      this.componentContent.chartType = 'column';
    }
  }

  isStudentDataTypeAvailableForComponent(
    nodeId: string,
    componentId: string,
    studentDataType: string
  ): boolean {
    const component = this.projectService.getComponent(nodeId, componentId);
    if (component != null) {
      if (studentDataType === 'scores') {
        return this.summaryService.isScoresSummaryAvailableForComponentType(component.type);
      } else if (studentDataType === 'responses') {
        return this.summaryService.isResponsesSummaryAvailableForComponentType(component.type);
      }
    }
    return false;
  }

  componentHasCorrectAnswer(): boolean {
    const nodeId = this.componentContent.summaryNodeId;
    const componentId = this.componentContent.summaryComponentId;
    if (nodeId != null && componentId != null) {
      const component = this.projectService.getComponent(nodeId, componentId);
      if (component != null) {
        const componentService = this.componentServiceLookupService.getService(component.type);
        return componentService.componentHasCorrectAnswer(component);
      }
    }
    return false;
  }

  componentAllowsMultipleResponses(): boolean {
    const nodeId = this.componentContent.summaryNodeId;
    const componentId = this.componentContent.summaryComponentId;
    if (nodeId != null && componentId != null) {
      const component = this.projectService.getComponent(nodeId, componentId);
      if (component != null) {
        return (component as MultipleChoiceContent).choiceType === 'checkbox';
      }
    }
    return false;
  }

  addCustomLabelColor(): void {
    if (this.componentContent.customLabelColors == null) {
      this.componentContent.customLabelColors = [];
    }
    this.componentContent.customLabelColors.push({ label: '', color: '' });
    this.componentChanged();
  }

  deleteCustomLabelColor(index: number): void {
    this.confirmAndRemove(
      $localize`Are you sure you want to delete this custom label color?`,
      this.componentContent.customLabelColors,
      index
    );
  }

  getComponents(nodeId: string): any[] {
    return this.projectService.getComponents(nodeId);
  }
}
