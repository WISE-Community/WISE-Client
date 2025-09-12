import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentInfoService } from '../../../services/componentInfoService';
import { ComponentInfoDialogComponent } from '../component-info-dialog/component-info-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule],
  selector: 'component-type-button',
  styleUrl: './component-type-button.component.scss',
  templateUrl: './component-type-button.component.html'
})
export class ComponentTypeButtonComponent {
  @Output() componentSelectedEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input() componentType: string;
  protected label: string;

  constructor(
    private componentInfoService: ComponentInfoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.label = this.componentInfoService.getInfo(this.componentType).getLabel();
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
}
