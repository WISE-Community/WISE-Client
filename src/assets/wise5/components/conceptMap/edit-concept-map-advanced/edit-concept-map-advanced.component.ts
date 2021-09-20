import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';

@Component({
  selector: 'edit-concept-map-advanced',
  templateUrl: 'edit-concept-map-advanced.component.html',
  styleUrls: ['edit-concept-map-advanced.component.scss']
})
export class EditConceptMapAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['ConceptMap', 'Draw', 'Embedded', 'Graph', 'Label', 'Table'];

  constructor(
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected ProjectService: TeacherProjectService,
    protected UtilService: UtilService
  ) {
    super(NodeService, NotebookService, ProjectService);
  }

  ruleTypeChanged(ruleIndex: number): void {
    const rule = this.authoringComponentContent.rules[ruleIndex];
    if (rule.type === 'node') {
      /*
       * the rule has been set to 'node' instead of 'link' so we
       * will remove the link label and other node label
       */
      delete rule.linkLabel;
      delete rule.otherNodeLabel;
    }
    this.componentChanged();
  }

  addRule(): void {
    const newRule = {
      name: '',
      type: 'node',
      categories: [],
      nodeLabel: '',
      comparison: 'exactly',
      number: 1,
      not: false
    };

    this.authoringComponentContent.rules.push(newRule);
    let showSubmitButton = false;
    if (this.authoringComponentContent.rules.length > 0) {
      showSubmitButton = true;
    }

    this.setShowSubmitButtonValue(showSubmitButton);
    this.componentChanged();
  }

  moveRuleUpButtonClicked(index: number): void {
    this.UtilService.moveObjectUp(this.authoringComponentContent.rules, index);
    this.componentChanged();
  }

  moveRuleDownButtonClicked(index: number): void {
    this.UtilService.moveObjectDown(this.authoringComponentContent.rules, index);
    this.componentChanged();
  }

  ruleDeleteButtonClicked(index: number): void {
    const rule = this.authoringComponentContent.rules[index];
    const ruleName = rule.name;
    if (confirm($localize`Are you sure you want to delete this rule?\n\nRule Name: ${ruleName}`)) {
      this.authoringComponentContent.rules.splice(index, 1);
      this.componentChanged();
    }

    let showSubmitButton = false;
    if (this.authoringComponentContent.rules.length > 0) {
      showSubmitButton = true;
    }
    this.setShowSubmitButtonValue(showSubmitButton);
  }

  addCategoryToRule(rule: any): void {
    rule.categories.push('');
    this.componentChanged();
  }

  deleteCategoryFromRule(rule: any, index: number): void {
    const ruleName = rule.name;
    const categoryName = rule.categories[index];
    if (
      confirm(
        $localize`Are you sure you want to delete the category from this rule?\n\nRule Name: ${ruleName}\nCategory Name: ${categoryName}`
      )
    ) {
      rule.categories.splice(index, 1);
      this.componentChanged();
    }
  }

  customTrackBy(index: number): any {
    return index;
  }
}
