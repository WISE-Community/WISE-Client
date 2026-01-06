import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatSelectModule],
  selector: 'component-type-selector',
  templateUrl: './component-type-selector.component.html'
})
export class ComponentTypeSelectorComponent {
  private componentTypeService = inject(ComponentTypeService);

  @Input() componentType: string;
  protected componentTypes: any[];
  @Output() componentTypeSelectedEvent: EventEmitter<string> = new EventEmitter<string>();
  protected firstComponent: boolean;
  protected lastComponent: boolean;

  ngOnInit(): void {
    this.componentTypes = this.componentTypeService.getComponentTypes();
    this.selectComponent(this.componentType);
  }

  protected selectComponent(componentType: string): void {
    this.componentType = componentType;
    const index = this.getComponentIndex(this.componentType);
    this.firstComponent = index === 0;
    this.lastComponent = index === this.componentTypes.length - 1;
    this.componentTypeSelectedEvent.emit(this.componentType);
  }

  protected goToPreviousComponent(): void {
    this.selectComponent(this.componentTypes[this.getComponentIndex(this.componentType) - 1].type);
  }

  protected goToNextComponent(): void {
    this.selectComponent(this.componentTypes[this.getComponentIndex(this.componentType) + 1].type);
  }

  private getComponentIndex(componentType: string): number {
    return this.componentTypes.findIndex((type) => type.type === componentType);
  }
}
