import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentState } from '../../../../app/domain/componentState';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ComponentStateInfoComponent } from '../../common/component-state-info/component-state-info.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [CommonModule, FlexLayoutModule, ComponentStateInfoComponent, MatButtonModule],
  selector: 'component-save-submit-buttons',
  standalone: true,
  styleUrl: 'component-save-submit-buttons.component.scss',
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
