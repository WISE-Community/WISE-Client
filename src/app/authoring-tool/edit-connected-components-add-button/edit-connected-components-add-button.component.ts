import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'edit-connected-components-add-button',
  styles: ['.connected-components-label-div { margin-bottom: 10px; } .mat-icon { margin: 0px; }'],
  template: `<div
    class="connected-components-label-div flex flex-row justify-start items-center gap-5"
  >
    <label i18n>Connected Components</label>
    <button
      mat-raised-button
      color="primary"
      (click)="addConnectedComponent()"
      matTooltip="Add Connected Component"
      matTooltip
      i18n-matTooltipPosition="above"
    >
      <mat-icon>add</mat-icon>
    </button>
  </div>`
})
export class EditConnectedComponentsAddButtonComponent {
  @Output() connectedComponentsChanged: EventEmitter<void> = new EventEmitter();

  protected addConnectedComponent(): void {
    this.connectedComponentsChanged.emit();
  }
}
