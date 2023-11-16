import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentInfo } from '../../../components/ComponentInfo';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { ComponentTypeService } from '../../../services/componentTypeService';

@Component({
  selector: 'component-info-dialog',
  templateUrl: './component-info-dialog.component.html',
  styleUrls: ['./component-info-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComponentInfoDialogComponent {
  protected component: any;
  private componentInfo: ComponentInfo;
  protected componentTypes: any[];
  protected description: string;
  protected firstComponent: boolean;
  protected label: string;
  protected lastComponent: boolean;

  constructor(
    private componentInfoService: ComponentInfoService,
    @Inject(MAT_DIALOG_DATA) protected componentType: string,
    private componentTypeService: ComponentTypeService
  ) {}

  ngOnInit(): void {
    this.componentTypes = this.componentTypeService.getComponentTypes();
    this.displayComponent(this.componentType);
  }

  protected displayComponent(componentType: any): void {
    this.componentType = componentType;
    this.componentInfo = this.componentInfoService.getInfo(componentType);
    this.label = this.componentInfo.getLabel();
    this.description = this.componentInfo.getDescription();
    this.component = new ComponentFactory().getComponent(
      this.componentInfo.getPreviewContent(),
      'node1'
    );
    const index = this.getComponentIndex(this.componentType);
    this.firstComponent = index === 0;
    this.lastComponent = index === this.componentTypes.length - 1;
  }

  protected goToPreviousComponent(): void {
    this.displayComponent(this.componentTypes[this.getComponentIndex(this.componentType) - 1].type);
  }

  protected goToNextComponent(): void {
    this.displayComponent(this.componentTypes[this.getComponentIndex(this.componentType) + 1].type);
  }

  private getComponentIndex(componentType: string): number {
    return this.componentTypes.findIndex((type) => type.type === componentType);
  }
}
