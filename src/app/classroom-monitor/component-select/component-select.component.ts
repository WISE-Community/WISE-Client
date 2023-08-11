import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ComponentTypeService } from '../../../assets/wise5/services/componentTypeService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

@Component({
  selector: 'component-select',
  styleUrls: ['component-select.component.scss'],
  templateUrl: 'component-select.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ComponentSelectComponent {
  components: any[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() nodeId: string;
  selectedComponents: any[];

  constructor(
    private componentTypeService: ComponentTypeService,
    private projectService: TeacherProjectService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.nodeId = changes.nodeId.currentValue;
    this.components = this.projectService.getComponents(this.nodeId).filter((component) => {
      return this.projectService.componentHasWork(component);
    });
    this.selectedComponents = this.components.map((component) => {
      return component.id;
    });
  }

  getComponentTypeLabel(componentType: string): string {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  getSelectedText(): string {
    return $localize`Showing ${this.selectedComponents.length}/${this.components.length} items`;
  }

  selectedComponentsChange(): void {
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
