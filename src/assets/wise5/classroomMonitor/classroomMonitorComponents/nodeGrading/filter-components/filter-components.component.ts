import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { ComponentContent } from '../../../../common/ComponentContent';

@Component({
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatSelectModule],
  selector: 'filter-components',
  templateUrl: './filter-components.component.html'
})
export class FilterComponentsComponent {
  @Input() components: ComponentContent[];
  @Output() componentsChange: EventEmitter<ComponentContent[]> = new EventEmitter<
    ComponentContent[]
  >();
  protected selectedComponents: ComponentContent[];
  protected selectedText: string;

  constructor(private componentTypeService: ComponentTypeService) {}

  ngOnChanges(): void {
    this.selectedComponents = this.components;
    this.updateSelectedText();
  }

  private updateSelectedText(): void {
    this.selectedText = $localize`Showing ${this.selectedComponents.length}/${this.components.length} items`;
  }

  protected getComponentTypeLabel(componentType: string): string {
    return this.componentTypeService.getComponentTypeLabel(componentType);
  }

  protected compareById(component1: ComponentContent, component2: ComponentContent): boolean {
    return component1?.id === component2?.id;
  }

  protected updateSelectedComponents(): void {
    this.updateSelectedText();
    this.componentsChange.emit(this.selectedComponents);
  }
}
