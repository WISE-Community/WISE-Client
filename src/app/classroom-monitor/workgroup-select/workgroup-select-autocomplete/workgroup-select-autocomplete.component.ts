'use strict';

import { Component, ViewEncapsulation } from '@angular/core';
import { WorkgroupSelectComponent } from '../workgroup-select.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { TeacherDataService } from '../../../../assets/wise5/services/teacherDataService';
import { copy } from '../../../../assets/wise5/common/object/object';

@Component({
  selector: 'workgroup-select-autocomplete',
  styleUrls: ['workgroup-select-autocomplete.component.scss'],
  templateUrl: 'workgroup-select-autocomplete.component.html',
  encapsulation: ViewEncapsulation.None
})
export class WorkgroupSelectAutocompleteComponent extends WorkgroupSelectComponent {
  filteredWorkgroups: Observable<any>;
  myControl = new FormControl();

  constructor(protected configService: ConfigService, protected dataService: TeacherDataService) {
    super(configService, dataService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.updateFilteredWorkgroups();
    const currentWorkgroup = this.dataService.getCurrentWorkgroup();
    if (currentWorkgroup) {
      this.myControl.setValue(currentWorkgroup.displayNames);
    }
  }

  private updateFilteredWorkgroups() {
    this.filteredWorkgroups = this.myControl.valueChanges.pipe(
      startWith(''),
      filter((value) => typeof value === 'string'),
      map((value) => this.filterByTypedKeyword(value))
    );
  }

  displayWith(workgroup) {
    return workgroup.displayNames;
  }

  private filterByTypedKeyword(value: string) {
    return this.workgroups.filter((workgroup) =>
      workgroup.displayNames.toLowerCase().includes(value.toLowerCase())
    );
  }

  currentPeriodChanged() {
    this.myControl.setValue('');
  }

  setWorkgroups() {
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

  getStudentsFromWorkgroups() {
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

  flipName(name: string) {
    const names = name.split(' ');
    return `${names[1]}, ${names[0]}`;
  }

  itemSelected(workgroup: any) {
    this.setCurrentWorkgroup(workgroup);
    this.updateWorkgroupDisplay(workgroup);
  }

  private updateWorkgroupDisplay(workgroup: any): void {
    if (workgroup) {
      this.myControl.setValue(workgroup.displayNames);
    } else {
      this.myControl.setValue('');
    }
  }

  closed(event: any) {
    if (this.myControl.value === '') {
      this.itemSelected(null);
    }
  }
}
