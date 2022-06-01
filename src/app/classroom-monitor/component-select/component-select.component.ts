import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentTypeService } from '../../../assets/wise5/services/componentTypeService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'component-select',
  styleUrls: ['component-select.component.scss'],
  templateUrl: 'component-select.component.html'
})
export class ComponentSelectComponent {
  components: any[];

  @Output()
  modelChange: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  nodeId: string;

  selectedComponents: any[];

  constructor(
    private componentTypeService: ComponentTypeService,
    private ProjectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.components = this.ProjectService.getComponentsByNodeId(this.nodeId).filter((component) => {
      return this.ProjectService.componentHasWork(component);
    });
    this.selectedComponents = this.components.map((component) => {
      return component.id;
    });
  }

  getComponentTypeLabel(componentType) {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  getSelectedText() {
    return $localize`Showing ${this.selectedComponents.length}/${this.components.length} items`;
  }

  selectedComponentsChange() {
    const hiddenComponents = [];
    for (const component of this.components) {
      const id = component.id;
      if (this.selectedComponents.indexOf(id) < 0) {
        hiddenComponents.push(id);
      }
    }
    this.modelChange.emit(hiddenComponents);
  }
}
