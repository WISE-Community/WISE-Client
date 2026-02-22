import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { WorkgroupSelectComponent } from '../workgroup-select.component';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { copy } from '../../../../assets/wise5/common/object/object';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  selector: 'workgroup-select-autocomplete',
  styleUrl: 'workgroup-select-autocomplete.component.scss',
  templateUrl: 'workgroup-select-autocomplete.component.html'
})
export class WorkgroupSelectAutocompleteComponent extends WorkgroupSelectComponent {
  protected filteredWorkgroups: Observable<any>;
  protected myControl = new FormControl();

  ngOnInit(): void {
    super.ngOnInit();
    this.updateFilteredWorkgroups();
    const currentWorkgroup = this.dataService.getCurrentWorkgroup();
    if (currentWorkgroup) {
      this.myControl.setValue(currentWorkgroup.displayNames);
    }
  }

  private updateFilteredWorkgroups(): void {
    this.filteredWorkgroups = this.myControl.valueChanges.pipe(
      startWith(''),
      filter((value) => typeof value === 'string'),
      map((value) => this.filterByTypedKeyword(value))
    );
  }

  protected displayWith(workgroup: any): string {
    return workgroup.displayNames;
  }

  private filterByTypedKeyword(value: string) {
    return this.workgroups.filter((workgroup) =>
      workgroup.displayNames.toLowerCase().includes(value.toLowerCase())
    );
  }

  protected currentPeriodChanged(): void {
    this.myControl.setValue('');
  }

  protected setWorkgroups(): void {
    this.filterWorkgroupsBySelectedPeriod();
    const students = this.getStudentsFromWorkgroups();
    this.workgroups = this.canViewStudentNames
      ? this.sortByDisplayNames(students)
      : this.sortByField(students, 'userId');
    this.updateFilteredWorkgroups();
  }

  protected setWorkgroup(workgroup: any): void {
    this.updateWorkgroupDisplay(workgroup);
  }

  private getStudentsFromWorkgroups(): any[] {
    const students = [];
    for (const workgroup of this.workgroups) {
      const ids = workgroup.userIds;
      const names = workgroup.displayNames.split(',');
      for (let x = 0; x < ids.length; x++) {
        const current = copy(workgroup);
        current.userId = ids[x];
        const name = names[x].trim();
        current.displayNames = name;
        if (this.canViewStudentNames) {
          current.displayNames = this.flipName(name);
        }
        students.push(current);
      }
    }
    return students;
  }

  private flipName(name: string): string {
    const names = name.split(' ');
    return `${names[1]}, ${names[0]}`;
  }

  protected itemSelected(workgroup: any): void {
    this.setCurrentWorkgroup(workgroup);
    this.updateWorkgroupDisplay(workgroup);
  }

  private updateWorkgroupDisplay(workgroup: any): void {
    this.myControl.setValue(workgroup ? workgroup.displayNames : '');
  }

  protected closed(event: any): void {
    if (this.myControl.value === '') {
      this.itemSelected(null);
    }
  }
}
