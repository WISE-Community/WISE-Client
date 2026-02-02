import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentContent } from '../../../common/ComponentContent';
import { EditComponentAdvancedComponent } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { Component as WiseComponent } from '../../../common/Component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'edit-component-advanced-button',
  templateUrl: 'edit-component-advanced-button.component.html'
})
export class EditComponentAdvancedButtonComponent {
  private dialog = inject(MatDialog);

  @Input() componentContent: ComponentContent;
  @Input() nodeId: string;

  protected showComponentAdvancedAuthoring(): void {
    this.dialog.open(EditComponentAdvancedComponent, {
      data: new WiseComponent(this.componentContent, this.nodeId),
      width: '80%'
    });
  }
}
