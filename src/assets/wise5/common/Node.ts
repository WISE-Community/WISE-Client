import { ComponentContent } from './ComponentContent';
import { TransitionLogic } from './TransitionLogic';
import { copy } from './object/object';
import { generateRandomKey } from './string/string';

export class Node {
  components: any[] = [];
  constraints: any[] = [];
  icons: any;
  icon: any;
  id: string;
  rubric: any;
  showSaveButton: boolean;
  showSubmitButton: boolean;
  title: string;
  transitionLogic?: TransitionLogic;
  type: string;

  getIcon(): any {
    if (this.icon == null) {
      this.setIcon();
    }
    return this.icon;
  }

  setIcon(): void {
    const defaultIcon = {
      color: '#757575',
      type: 'font',
      fontSet: 'material-icons',
      fontName: this.type === 'group' ? 'explore' : 'school',
      imgSrc: ''
    };
    let icon;
    if (this.icons != null && this.icons.default != null) {
      icon = $.extend(true, defaultIcon, this.icons.default);
    } else {
      icon = defaultIcon;
    }
    if (!icon.imgSrc) {
      icon.type = 'font';
    }
    this.icon = icon;
  }

  isGroup(): boolean {
    return this.type === 'group';
  }

  isEvaluateTransitionLogicOn(event: string): boolean {
    return this.getTransitionLogic().whenToChoosePath === event;
  }

  getNodeIdComponentIds(): any {
    return this.components.map((component) => {
      return { nodeId: this.id, componentId: component.id };
    });
  }

  getComponent(componentId: string): any {
    return this.components.find((component) => component.id === componentId);
  }

  hasComponent(componentId: string): boolean {
    return this.components.some((component) => component.id === componentId);
  }

  getTransitionLogic(): TransitionLogic {
    if (this.transitionLogic == null) {
      this.transitionLogic = {
        transitions: []
      };
    }
    return this.transitionLogic;
  }

  /**
   * Move the component(s) within this node
   * @param componentIds the id(s) of the component(s) to move
   * @param insertAfterComponentId insert the component(s) after this component id.
   * If this argument is null, place the new component(s) in the first position.
   */
  moveComponents(componentIds: string[], insertAfterComponentId: string = null): void {
    const components = this.extractComponents(componentIds);
    if (insertAfterComponentId == null) {
      this.components.unshift(...components);
    } else {
      this.insertComponentsAfter(components, insertAfterComponentId);
    }
  }

  private extractComponents(componentIds: string[]): any[] {
    const components = [];
    for (let i = 0; i < this.components.length; i++) {
      if (componentIds.includes(this.components[i].id)) {
        components.push(this.components.splice(i--, 1)[0]);
      }
    }
    return components;
  }

  private insertComponentsAfter(components: any[], insertAfterComponentId: string): void {
    const insertAfterComponentIndex = this.components.findIndex(
      (component) => component.id === insertAfterComponentId
    );
    this.components.splice(insertAfterComponentIndex + 1, 0, ...components);
  }

  copyComponents(componentIds: string[], insertAfterComponentId: string = null): any[] {
    const newComponents = [];
    const newComponentIds = [];
    for (const componentId of componentIds) {
      const newComponent = this.copyComponent(componentId, newComponentIds);
      newComponents.push(newComponent);
      newComponentIds.push(newComponent.id);
    }
    this.insertComponents(newComponents, insertAfterComponentId);
    return newComponents;
  }

  private copyComponent(componentId: string, componentIdsToSkip: string[]): any {
    const component = this.getComponent(componentId);
    const newComponent = copy(component);
    newComponent.id = this.getUnusedComponentId(componentIdsToSkip);
    return newComponent;
  }

  private getUnusedComponentId(componentIdsToSkip: string[]): string {
    let newComponentId = generateRandomKey();
    while (this.isComponentIdInUse(newComponentId) || componentIdsToSkip.includes(newComponentId)) {
      newComponentId = generateRandomKey();
    }
    return newComponentId;
  }

  private isComponentIdInUse(componentId: string): boolean {
    return this.components.some((component) => component.id === componentId);
  }

  private insertComponents(components: any[], insertAfterComponentId: string): void {
    const insertPosition = this.getInitialInsertPosition(insertAfterComponentId);
    this.components.splice(insertPosition, 0, ...components);
  }

  private getInitialInsertPosition(insertAfterComponentId: string): number {
    return insertAfterComponentId == null
      ? 0
      : this.components.findIndex((component) => component.id === insertAfterComponentId) + 1;
  }

  deleteComponent(componentId: string): ComponentContent {
    return this.components.splice(this.getComponentIndex(componentId), 1)[0];
  }

  replaceComponent(componentId: string, component: ComponentContent): void {
    this.components[this.getComponentIndex(componentId)] = component;
  }

  private getComponentIndex(componentId: string): number {
    return this.components.findIndex((component) => component.id === componentId);
  }

  getAllRelatedComponents(): any {
    const components = this.getNodeIdComponentIds();
    return [
      ...components,
      ...this.getShowMyWorkStudentData(),
      ...this.getConnectedComponentsWithRequiredStudentData()
    ];
  }

  private getShowMyWorkStudentData(): any[] {
    return this.components
      .filter((component: any) => component.type === 'ShowMyWork')
      .map((component: any) => {
        return { nodeId: component.showWorkNodeId, componentId: component.showWorkComponentId };
      });
  }

  private getConnectedComponentsWithRequiredStudentData(): any[] {
    const connectedComponents = [];
    for (const component of this.components) {
      if (this.isConnectedComponentStudentDataRequired(component)) {
        for (const connectedComponent of component.connectedComponents) {
          connectedComponents.push(connectedComponent);
        }
      }
    }
    return connectedComponents;
  }

  private isConnectedComponentStudentDataRequired(componentContent: any): boolean {
    return (
      componentContent.type === 'Discussion' &&
      componentContent.connectedComponents != null &&
      componentContent.connectedComponents.length !== 0
    );
  }

  getConstraints(): any[] {
    return this.constraints;
  }

  deleteTransition(transition: any): void {
    const transitions = this.transitionLogic.transitions;
    const index = transitions.indexOf(transition);
    if (index > -1) {
      transitions.splice(index, 1);
    }
    if (transitions.length <= 1) {
      // these settings only apply when there are multiple transitions
      this.transitionLogic.howToChooseAmongAvailablePaths = null;
      this.transitionLogic.whenToChoosePath = null;
      this.transitionLogic.canChangePath = null;
      this.transitionLogic.maxPathsVisitable = null;
    }
  }

  getNumRubrics(): number {
    let numRubrics = 0;
    if (this.rubric != null && this.rubric != '') {
      numRubrics++;
    }
    numRubrics += this.components.filter(
      (component) => component.rubric != null && component.rubric != ''
    ).length;
    return numRubrics;
  }
}
