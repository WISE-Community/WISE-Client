import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ComponentTypeButtonComponent } from '../../../../assets/wise5/authoringTool/components/component-type-button/component-type-button.component';
import { ComponentTypeService } from '../../../../assets/wise5/services/componentTypeService';

@Component({
  imports: [ComponentTypeButtonComponent, MatButtonModule, MatDialogModule],
  styles: ['component-type-button { width: 250px; padding: 4px; }'],
  templateUrl: 'choose-new-component.component.html'
})
export class ChooseNewComponent {
  private componentTypeService = inject(ComponentTypeService);
  private dialogRef = inject(MatDialogRef<ChooseNewComponent>);

  protected componentTypes: any[];

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
