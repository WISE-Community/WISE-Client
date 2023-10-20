import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentInfoDialogComponent } from '../component-info-dialog/component-info-dialog.component';

@Component({
  selector: 'component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent {
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
      panelClass: 'dialog-lg'
    });
  }

  protected select(): void {
    this.componentSelectedEvent.emit();
  }
}
