import { Component } from '@angular/core';
import { ComponentTypeService } from '../../../../assets/wise5/services/componentTypeService';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { ComponentTypeButtonComponent } from '../../../../assets/wise5/authoringTool/components/component-type-button/component-type-button.component';

@Component({
  imports: [
    CommonModule,
    ComponentTypeButtonComponent,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule
  ],
  standalone: true,
  styleUrl: './choose-new-component.component.scss',
  templateUrl: 'choose-new-component.component.html'
})
export class ChooseNewComponent {
  protected componentTypes: any[];

  constructor(
    private componentTypeService: ComponentTypeService,
    private dialogRef: MatDialogRef<ChooseNewComponent>
  ) {}

  ngOnInit(): void {
    this.componentTypes = this.componentTypeService.getComponentTypes();
  }

  protected goToImportComponent(): void {
    this.dialogRef.close({ action: 'import' });
  }

  protected selectComponent(componentType: string): void {
    this.dialogRef.close({ action: 'create', componentType: componentType });
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
