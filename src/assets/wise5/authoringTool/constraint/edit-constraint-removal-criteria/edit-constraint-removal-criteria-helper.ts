import { ComponentContent } from '../../../common/ComponentContent';
import { ProjectService } from '../../../services/projectService';

export class EditConstraintRemovalCriteriaHelper {
  criteriaNameToComponentType: Map<string, string> = new Map(
    Object.entries({
      choiceChosen: 'MultipleChoice',
      fillXNumberOfRows: 'Table',
      wroteXNumberOfWords: 'OpenResponse'
    })
  );

  constructor(private projectService: ProjectService, private componentIdToIsSelectable: any) {}

  hasCriteriaNameToComponentType(criteriaName: string): boolean {
    return this.criteriaNameToComponentType.has(criteriaName);
  }

  getCriteriaNameToComponentType(criteriaName: string): string {
    return this.criteriaNameToComponentType.get(criteriaName);
  }

  stepContainsAcceptableComponent(nodeId: string, criteria: any): boolean {
    if (this.criteriaNameToComponentType.has(criteria.name)) {
      return this.hasComponentType(nodeId, this.criteriaNameToComponentType.get(criteria.name));
    }
    return true;
  }

  private hasComponentType(nodeId: string, componentType: string): boolean {
    return (
      this.projectService
        .getComponents(nodeId)
        .filter((component) => component.type === componentType).length > 0
    );
  }

  calculateSelectableComponents(criteria: any): void {
    const components = this.projectService.getComponents(criteria.params.nodeId);
    if (this.criteriaNameToComponentType.has(criteria.name)) {
      this.setSelectableComponents(components, this.criteriaNameToComponentType.get(criteria.name));
    } else {
      this.makeAllComponentsSelectable(components);
    }
  }

  private setSelectableComponents(components: ComponentContent[], componentType: string): void {
    components.forEach((component) => {
      this.componentIdToIsSelectable[component.id] = component.type === componentType;
    });
  }

  private makeAllComponentsSelectable(components: ComponentContent[]): void {
    components.forEach((component) => {
      this.componentIdToIsSelectable[component.id] = true;
    });
  }

  automaticallySelectComponentIfPossible(criteria: any): void {
    if (this.criteriaNameToComponentType.has(criteria.name)) {
      this.selectIfOnlyOneOfComponentType(
        criteria,
        this.projectService.getComponents(criteria.params.nodeId),
        this.criteriaNameToComponentType.get(criteria.name)
      );
    }
  }

  private selectIfOnlyOneOfComponentType(
    criteria: any,
    components: ComponentContent[],
    componentType: string
  ): void {
    if (components.filter((component) => component.type === componentType).length === 1) {
      criteria.params.componentId = components.find(
        (component) => component.type === componentType
      ).id;
    }
  }
}
