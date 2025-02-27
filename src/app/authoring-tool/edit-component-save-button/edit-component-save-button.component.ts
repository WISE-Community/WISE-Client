import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';

@Component({
    selector: 'edit-component-save-button',
    templateUrl: 'edit-component-save-button.component.html',
    styleUrls: ['edit-component-save-button.component.scss'],
    standalone: false
})
export class EditComponentSaveButtonComponent extends EditComponentFieldComponent {}
