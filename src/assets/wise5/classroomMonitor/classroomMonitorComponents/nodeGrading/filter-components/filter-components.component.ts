import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ComponentContent } from '../../../../common/ComponentContent';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ComponentInfoService } from '../../../../services/componentInfoService';

@Component({
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule
  ],
  selector: 'filter-components',
  styleUrl: './filter-components.component.scss',
  templateUrl: './filter-components.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FilterComponentsComponent {
  @Input() components: ComponentContent[];
  @Output() componentsChange: EventEmitter<ComponentContent[]> = new EventEmitter<
    ComponentContent[]
  >();
  @Input() selectedComponents: ComponentContent[];
  protected selectedText: string;

  constructor(private componentInfoService: ComponentInfoService) {}

  ngOnChanges(): void {
    this.updateSelectedText();
  }

  private updateSelectedText(): void {
    this.selectedText = $localize`Showing ${this.selectedComponents.length}/${this.components.length} questions`;
  }

  protected getComponentTypeIcon(componentType: string): string {
    return this.componentInfoService.getInfo(componentType).getIcon();
  }

  protected getComponentTypeLabel(componentType: string): string {
    return this.componentInfoService.getInfo(componentType).getLabel();
  }

  protected compareById(component1: ComponentContent, component2: ComponentContent): boolean {
    return component1?.id === component2?.id;
  }

  protected updateSelectedComponents(): void {
    this.updateSelectedText();
    this.componentsChange.emit(this.selectedComponents);
  }
}
