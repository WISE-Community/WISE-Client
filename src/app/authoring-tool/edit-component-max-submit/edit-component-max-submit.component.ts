import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'edit-component-max-submit',
  styleUrl: './edit-component-max-submit.component.scss',
  templateUrl: './edit-component-max-submit.component.html'
})
export class EditComponentMaxSubmitComponent extends EditComponentFieldComponent {}
