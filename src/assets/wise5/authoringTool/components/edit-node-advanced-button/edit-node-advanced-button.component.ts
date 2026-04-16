import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NodeAdvancedAuthoringComponent } from '../../node/advanced/node-advanced-authoring/node-advanced-authoring.component';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'edit-node-advanced-button',
  styles: ['.mat-icon { margin: 0; }'],
  template: `<button
    class="enable-in-translation"
    mat-raised-button
    color="primary"
    (click)="showNodeAdvancedAuthoring()"
    matTooltip="Advanced"
    matTooltipPosition="above"
    i18n-matTooltip
  >
    <mat-icon>build</mat-icon>
  </button>`
})
export class EditNodeAdvancedButtonComponent {
  @Input() nodeId: string;

  constructor(private dialog: MatDialog) {}

  protected showNodeAdvancedAuthoring(): void {
    this.dialog.open(NodeAdvancedAuthoringComponent, {
      data: this.nodeId,
      width: '80%'
    });
  }
}
