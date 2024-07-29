import { Component } from '@angular/core';
import { EditComponentFieldComponent } from '../edit-component-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  selector: 'edit-component-width',
  standalone: true,
  templateUrl: 'edit-component-width.component.html'
})
export class EditComponentWidthComponent extends EditComponentFieldComponent {}
