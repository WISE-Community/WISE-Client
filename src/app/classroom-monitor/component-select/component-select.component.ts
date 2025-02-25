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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
    selector: 'component-select',
    styleUrl: 'component-select.component.scss',
    templateUrl: 'component-select.component.html'
})
export class ComponentSelectComponent {
  protected components: any[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() nodeId: string;
  protected selectedComponents: any[];

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

  protected getComponentTypeLabel(componentType: string): string {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  protected getSelectedText(): string {
    return $localize`Showing ${this.selectedComponents.length}/${this.components.length} items`;
  }

  protected selectedComponentsChange(): void {
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
