import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component as WiseComponent } from '../../../assets/wise5/common/Component';

@Component({
  selector: 'edit-component-advanced',
  templateUrl: './edit-component-advanced.component.html',
  styleUrls: ['./edit-component-advanced.component.scss']
})
export class EditComponentAdvancedComponent {
  constructor(@Inject(MAT_DIALOG_DATA) protected component: WiseComponent) {}
}
