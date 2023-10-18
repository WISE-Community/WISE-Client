import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFactory } from '../../../common/ComponentFactory';
import { MatDialog } from '@angular/material/dialog';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentInfoDialogComponent } from '../component-info-dialog/component-info-dialog.component';

@Component({
  selector: 'component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent {
  @Output() componentSelectedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input() componentType: string;
  private componentTypeObject: any;
  private description: string;
  protected label: string;
  private previewContent: any;

  constructor(private componentInfoService: ComponentInfoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.label = this.componentInfoService.getLabel(this.componentType);
    this.componentTypeObject = { type: this.componentType, name: this.label };
    this.description = this.componentInfoService.getDescription(this.componentType);
    this.previewContent = this.componentInfoService.getPreviewContent(this.componentType);
  }

  protected preview(): void {
    this.dialog.open(ComponentInfoDialogComponent, {
      data: {
        component: new ComponentFactory().getComponent(this.previewContent, 'node1'),
        description: this.description,
        label: this.label
      },
      panelClass: 'dialog-lg'
    });
  }

  protected select(): void {
    this.componentSelectedEvent.emit(this.componentTypeObject);
  }
}
