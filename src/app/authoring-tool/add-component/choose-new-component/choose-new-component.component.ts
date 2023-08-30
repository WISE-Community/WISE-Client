import { Component } from '@angular/core';
import { ComponentTypeService } from '../../../../assets/wise5/services/componentTypeService';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'choose-new-component',
  styleUrls: ['./choose-new-component.component.scss'],
  templateUrl: 'choose-new-component.component.html'
})
export class ChooseNewComponent {
  componentTypes: any[];

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
