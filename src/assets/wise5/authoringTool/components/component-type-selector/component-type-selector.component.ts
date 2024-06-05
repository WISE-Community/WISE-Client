import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule
  ],
  selector: 'component-type-selector',
  standalone: true,
  styleUrl: './component-type-selector.component.scss',
  templateUrl: './component-type-selector.component.html'
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
