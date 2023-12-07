import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';

@Component({
  selector: 'select-all-projects-checkbox',
  templateUrl: './select-all-projects-checkbox.component.html',
  styleUrls: ['./select-all-projects-checkbox.component.scss'],
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }]
})
export class SelectAllProjectsCheckboxComponent {
  @Input() selectedAllProjects: boolean = false;
  @Input() selectedSomeProjects: boolean = false;
  @Output()
  selectAllProjectsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected selectAllProjectsCheckboxClicked(): void {
    if (this.selectedAllProjects || this.selectedSomeProjects) {
      this.selectedAllProjects = false;
      this.selectedSomeProjects = false;
    } else {
      this.selectedAllProjects = true;
    }
    this.selectAllProjectsChanged.emit(this.selectedAllProjects);
  }
}
