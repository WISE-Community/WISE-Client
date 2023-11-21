import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentTypeService } from '../../../services/componentTypeService';

@Component({
  selector: 'component-type-selector',
  templateUrl: './component-type-selector.component.html',
  styleUrls: ['./component-type-selector.component.scss']
})
export class ComponentTypeSelectorComponent {
  @Input() componentType: string;
  protected componentTypes: any[];
  @Output() componentTypeSelectedEvent: EventEmitter<string> = new EventEmitter<string>();
  protected firstComponent: boolean;
  protected lastComponent: boolean;

  constructor(private componentTypeService: ComponentTypeService) {}

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
