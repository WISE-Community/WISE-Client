import { Component, Inject } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { ComponentTypeService } from '../../../../assets/wise5/services/componentTypeService';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'choose-new-component',
  styleUrls: ['./choose-new-component.component.scss'],
  templateUrl: 'choose-new-component.component.html'
})
export class ChooseNewComponent {
  componentTypes: any[];
  selectedComponentType: string;

  constructor(
    private componentTypeService: ComponentTypeService,
    private dialogRef: MatDialogRef<ChooseNewComponent>,
    @Inject(MAT_DIALOG_DATA) private insertAfterComponentId: string,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.componentTypes = this.componentTypeService.getComponentTypes();
    this.selectedComponentType = this.upgrade.$injector.get('$stateParams').componentType;
  }

  protected goToImportComponent(): void {
    this.dialogRef.close();
    this.upgrade.$injector.get('$state').go('root.at.project.node.import-component.choose-step', {
      insertAfterComponentId: this.insertAfterComponentId
    });
  }

  protected selectComponent(componentType: string): void {
    this.dialogRef.close(componentType);
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
