import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentTypeButtonComponent } from '../../../assets/wise5/authoringTool/components/component-type-button/component-type-button.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [ComponentTypeButtonComponent, MatCardModule],
  selector: 'component-type-group',
  styles: `
    @reference "tailwindcss";
    :host {
      --mat-card-filled-container-color: var(--color-gray-100);
      --mat-card-title-text-size: var(--mat-sys-title-medium-font-size);
      --mat-card-title-text-line-height: var(--mat-sys-title-medium-line-height);
    }
    .mat-mdc-card-header {
      padding: 12px 12px 0;
    }
    .mat-mdc-card-content {
      padding-left: 12px;
      padding-right: 12px;

      &:last-child {
        padding-bottom: 12px;
      }
    }
  `,
  templateUrl: './component-type-group.component.html'
})
export class ComponentTypeGroupComponent {
  @Input() componentGroup: any;
  @Output() componentSelectedEvent = new EventEmitter<any>();
}
