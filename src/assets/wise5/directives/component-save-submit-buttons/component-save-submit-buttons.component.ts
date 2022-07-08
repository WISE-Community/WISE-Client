import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentState } from '../../../../app/domain/componentState';

@Component({
  selector: 'component-save-submit-buttons',
  styleUrls: ['component-save-submit-buttons.component.scss'],
  templateUrl: 'component-save-submit-buttons.component.html'
})
export class ComponentSaveSubmitButtons {
  @Input()
  isDirty: boolean;

  @Input()
  isDisabled: boolean;

  @Input()
  isSaveButtonVisible: boolean;

  @Input()
  isSubmitButtonDisabled: boolean;

  @Input()
  isSubmitButtonVisible: boolean;

  @Input()
  isSubmitDirty: boolean;

  @Input()
  componentState: ComponentState;

  @Output()
  saveButtonClicked = new EventEmitter<void>();

  @Output()
  submitButtonClicked = new EventEmitter<void>();

  save() {
    this.saveButtonClicked.next();
  }

  submit() {
    this.submitButtonClicked.next();
  }
}
