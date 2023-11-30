import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentInfoDialogComponent } from '../component-info-dialog/component-info-dialog.component';

@Component({
  selector: 'component-type-button',
  templateUrl: './component-type-button.component.html',
  styleUrls: ['./component-type-button.component.scss']
})
export class ComponentTypeButtonComponent {
  private componentInfo: any;
  @Output() componentSelectedEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() componentType: string;
  protected label: string;

  constructor(private componentInfoService: ComponentInfoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.componentInfo = this.componentInfoService.getInfo(this.componentType);
    this.label = this.componentInfo.getLabel();
  }

  protected preview(): void {
    this.dialog.open(ComponentInfoDialogComponent, {
      data: this.componentType,
      panelClass: 'dialog-lg',
      position: {
        top: '100px'
      }
    });
  }

  protected select(): void {
    this.componentSelectedEvent.emit();
  }
}
