import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentState } from '../../../../app/domain/componentState';
import { MatButtonModule } from '@angular/material/button';
import { ComponentStateInfoComponent } from '../../common/component-state-info/component-state-info.component';

@Component({
  imports: [ComponentStateInfoComponent, MatButtonModule],
  selector: 'component-save-submit-buttons',
  styles: ['.mat-mdc-button { min-width: 88px; } .save-message { font-style: italic; } '],
  templateUrl: 'component-save-submit-buttons.component.html'
})
export class ComponentSaveSubmitButtonsComponent {
  @Input() componentState: ComponentState;
  @Input() isDirty: boolean;
  @Input() isDisabled: boolean;
  @Input() isSaveButtonVisible: boolean;
  @Input() isSubmitButtonDisabled: boolean;
  @Input() isSubmitButtonVisible: boolean;
  @Input() isSubmitDirty: boolean;
  @Output() saveButtonClicked = new EventEmitter<void>();
  @Output() submitButtonClicked = new EventEmitter<void>();
}
