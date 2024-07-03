import { Component, Input, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { RemovalCriteria } from '../../../../../app/domain/removalCriteria';
import { RemovalCriteriaParam } from '../../../../../app/domain/removalCriteriaParam';
import { ComponentContent } from '../../../common/ComponentContent';
import { MultipleChoiceContent } from '../../../components/multipleChoice/MultipleChoiceContent';
import { EditConstraintRemovalCriteriaHelper } from './edit-constraint-removal-criteria-helper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RequiredErrorLabelComponent } from '../../node/advanced/required-error-label/required-error-label.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    RequiredErrorLabelComponent
  ],
  selector: 'edit-constraint-removal-criteria',
  standalone: true,
  styleUrl: './edit-constraint-removal-criteria.component.scss',
  templateUrl: './edit-constraint-removal-criteria.component.html'
})
export class EditConstraintRemovalCriteriaComponent implements OnInit {
  private allNodeIds: string[];
  protected componentIdToIsSelectable: { [componentId: string]: boolean } = {};
  private componentParam: RemovalCriteriaParam = new RemovalCriteriaParam(
    'componentId',
    $localize`Component`
  );
  @Input() constraint: any;
  @Input() criteria: any;
  @Input() node: any;
  protected nodeIds: string[];
  private removalCriteriaHelper: EditConstraintRemovalCriteriaHelper;
  private stepParam: RemovalCriteriaParam = new RemovalCriteriaParam('nodeId', $localize`Step`);

  protected removalCriteria = [
    new RemovalCriteria('', $localize`Please Choose a Removal Criteria`, []),
    new RemovalCriteria('isCompleted', $localize`Is Completed`, [this.stepParam]),
    new RemovalCriteria('score', $localize`Score`, [
      this.stepParam,
      this.componentParam,
      new RemovalCriteriaParam('scores', $localize`Score(s)`)
    ]),
    new RemovalCriteria('branchPathTaken', $localize`Branch Path Taken`, [
      new RemovalCriteriaParam('fromNodeId', $localize`From Step`),
      new RemovalCriteriaParam('toNodeId', $localize`To Step`)
    ]),
    new RemovalCriteria('choiceChosen', $localize`Choice Chosen`, [
      this.stepParam,
      this.componentParam,
      new RemovalCriteriaParam('choiceIds', $localize`Choices`)
    ]),
    new RemovalCriteria('isCorrect', $localize`Is Correct`, [this.stepParam, this.componentParam]),
    new RemovalCriteria('usedXSubmits', $localize`Used X Submits`, [
      this.stepParam,
      this.componentParam,
      new RemovalCriteriaParam('requiredSubmitCount', $localize`Required Submit Count`)
    ]),
    new RemovalCriteria('isVisible', $localize`Is Visible`, [this.stepParam]),
    new RemovalCriteria('isVisitable', $localize`Is Visitable`, [this.stepParam]),
    new RemovalCriteria('isVisited', $localize`Is Visited`, [this.stepParam]),
    new RemovalCriteria('wroteXNumberOfWords', $localize`Wrote X Number of Words`, [
      this.stepParam,
      this.componentParam,
      new RemovalCriteriaParam('requiredNumberOfWords', $localize`Required Number of Words`)
    ]),
    new RemovalCriteria(
      'addXNumberOfNotesOnThisStep',
      $localize`Add X Number of Notes On This Step`,
      [
        this.stepParam,
        new RemovalCriteriaParam('requiredNumberOfNotes', $localize`Required Number of Notes`)
      ]
    ),
    new RemovalCriteria('fillXNumberOfRows', $localize`Fill X Number of Rows`, [
      this.stepParam,
      this.componentParam,
      new RemovalCriteriaParam(
        'requiredNumberOfFilledRows',
        $localize`Required Number of Filled Rows (Not Including Header Row)`
      ),
      new RemovalCriteriaParam('tableHasHeaderRow', $localize`Table Has Header Row`, true),
      new RemovalCriteriaParam(
        'requireAllCellsInARowToBeFilled',
        $localize`Require All Cells In a Row To Be Filled`,
        true
      )
    ]),
    new RemovalCriteria('teacherRemoval', $localize`Teacher Removes Constraint`, [])
  ];

  constructor(private projectService: TeacherProjectService) {}

  ngOnInit(): void {
    this.allNodeIds = this.projectService.getFlattenedProjectAsNodeIds(true);
    this.removalCriteriaHelper = new EditConstraintRemovalCriteriaHelper(
      this.projectService,
      this.componentIdToIsSelectable
    );
    this.setNodeIds();
    this.removalCriteriaHelper.calculateSelectableComponents(this.criteria);
  }

  private setNodeIds(): void {
    this.nodeIds = this.removalCriteriaHelper.hasCriteriaNameToComponentType(this.criteria.name)
      ? this.getStepsWithComponentType(
          this.allNodeIds,
          this.removalCriteriaHelper.getCriteriaNameToComponentType(this.criteria.name)
        )
      : this.allNodeIds;
  }

  private getStepsWithComponentType(allNodeIds: string[], componentType: string): any[] {
    return allNodeIds.filter((nodeId) =>
      this.projectService
        .getNode(nodeId)
        .components.some((component) => component.type === componentType)
    );
  }

  protected deleteRemovalCriteria(): void {
    if (confirm($localize`Are you sure you want to delete this removal criteria?`)) {
      const removalCriteria = this.constraint.removalCriteria;
      removalCriteria.splice(removalCriteria.indexOf(this.criteria), 1);
      this.saveProject();
    }
  }

  protected nameChanged(criteria: any): void {
    criteria.params = {};
    const params = this.getParamsByName(criteria.name);
    for (const paramObject of params) {
      const value = paramObject.value;
      criteria.params[value] = paramObject.defaultValue;
      if (
        value === 'nodeId' &&
        this.removalCriteriaHelper.stepContainsAcceptableComponent(this.node.id, criteria)
      ) {
        criteria.params[value] = this.node.id;
      }
    }
    this.setNodeIds();
    this.removalCriteriaHelper.calculateSelectableComponents(criteria);
    this.removalCriteriaHelper.automaticallySelectComponentIfPossible(criteria);
    this.saveProject();
  }

  protected getParamsByName(name: string): any[] {
    for (const singleRemovalCriteria of this.removalCriteria) {
      if (singleRemovalCriteria.value === name) {
        return singleRemovalCriteria.params;
      }
    }
    return [];
  }

  protected nodeIdChanged(criteria: any): void {
    criteria.params.componentId = '';
    this.removalCriteriaHelper.calculateSelectableComponents(criteria);
    this.removalCriteriaHelper.automaticallySelectComponentIfPossible(criteria);
    this.saveProject();
  }

  protected getNodePosition(nodeId: string): string {
    return this.projectService.getNodePositionById(nodeId);
  }

  protected getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  protected getComponents(nodeId: string): ComponentContent[] {
    return this.projectService.getComponents(nodeId);
  }

  protected scoresChanged(value: any, params: any): void {
    params.scores = value.split(',');
    this.saveProject();
  }

  protected getChoiceType(nodeId: string, componentId: string): string {
    const component = this.projectService.getComponent(
      nodeId,
      componentId
    ) as MultipleChoiceContent;
    return component != null && component.choiceType != null ? component.choiceType : null;
  }

  protected getChoices(nodeId: string, componentId: string): any[] {
    return this.projectService.getChoices(nodeId, componentId);
  }

  protected saveProject(): void {
    this.projectService.saveProject();
  }
}
