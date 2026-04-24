import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditComponentAdvancedComponent } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { Component as WiseComponent } from '../../../common/Component';
import { ComponentContent } from '../../../common/ComponentContent';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'visibility-constraint-icon',
  template: `<button
    mat-icon-button
    (click)="openVisibilityConstraintAuthoring()"
    [matTooltip]="tooltip"
    matTooltipPosition="above"
  >
    <mat-icon>visibility_off</mat-icon>
  </button>`
})
export class VisibilityConstraintIconComponent {
  private dialog = inject(MatDialog);

  @Input() componentContent: ComponentContent;
  @Input() nodeId: string;

  protected tooltip = $localize`This activity is displayed to the student when certain conditions are met. Click to view and edit the conditions.`;

  protected openVisibilityConstraintAuthoring(): void {
    this.dialog.open(EditComponentAdvancedComponent, {
      data: { component: new WiseComponent(this.componentContent, this.nodeId), tab: 'visibility' },
      width: '80%'
    });
  }
}
