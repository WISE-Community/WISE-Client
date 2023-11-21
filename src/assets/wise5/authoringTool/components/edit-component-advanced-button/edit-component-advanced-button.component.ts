import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentContent } from '../../../common/ComponentContent';
import { EditComponentAdvancedComponent } from '../../../../../app/authoring-tool/edit-component-advanced/edit-component-advanced.component';
import { Component as WiseComponent } from '../../../common/Component';

@Component({
  selector: 'edit-component-advanced-button',
  templateUrl: 'edit-component-advanced-button.component.html'
})
export class EditComponentAdvancedButtonComponent {
  @Input() componentContent: ComponentContent;
  @Input() nodeId: string;

  constructor(private dialog: MatDialog) {}

  protected showComponentAdvancedAuthoring(event: Event): void {
    event.stopPropagation();
    this.dialog.open(EditComponentAdvancedComponent, {
      data: new WiseComponent(this.componentContent, this.nodeId),
      width: '80%'
    });
  }
}
