import { Component } from '@angular/core';
import { SelectMenuComponent } from '../select-menu/select-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {
  Location,
  LocationOption,
  LocationType,
  locationTypeToLabel
} from '../../library/Location';

@Component({
  imports: [FormsModule, MatSelectModule, ReactiveFormsModule],
  selector: 'location-select-menu',
  templateUrl: './location-select-menu.component.html'
})
export class LocationSelectMenuComponent extends SelectMenuComponent {
  protected labels: LocationType[];
  protected locationOptions = { level3: [], level2: [], level1: [] };
  protected locationTypeToLabel = locationTypeToLabel;

  ngOnInit(): void {
    super.ngOnInit();
    this.options
      .flatMap((option: Location) => option.getLocationOptions())
      .forEach((option: LocationOption) => {
        if (!this.locationOptions[option.type].some((opt) => opt.id === option.id)) {
          this.locationOptions[option.type].push(option);
        }
      });
    this.labels = Object.keys(this.locationOptions).filter(
      (key: LocationType) => this.locationOptions[key].length > 0
    ) as LocationType[];
  }
}
