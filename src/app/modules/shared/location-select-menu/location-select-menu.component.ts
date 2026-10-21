import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { SelectMenuComponent } from '../select-menu/select-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  Location,
  LocationOption,
  LocationType,
  locationTypeToLabel
} from '../../library/Location';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  selector: 'location-select-menu',
  templateUrl: './location-select-menu.component.html'
})
export class LocationSelectMenuComponent extends SelectMenuComponent {
  protected locationTypeToLabel = locationTypeToLabel;

  protected readonly groupedLocations = computed(() => {
    const options = this.options();
    const locationOptions: Record<LocationType, LocationOption[]> = {
      level3: [],
      level2: [],
      level1: []
    };

    options
      .flatMap((option: Location) => option.getLocationOptions())
      .forEach((option: LocationOption) => {
        if (!locationOptions[option.type].some((opt) => opt.name === option.name)) {
          locationOptions[option.type].push(option);
        }
      });

    (Object.keys(locationOptions) as LocationType[]).forEach((key: LocationType) =>
      locationOptions[key].sort((a: LocationOption, b: LocationOption) =>
        a.name.localeCompare(b.name)
      )
    );

    const labels = (Object.keys(locationOptions) as LocationType[]).filter(
      (key: LocationType) => locationOptions[key].length > 0
    );

    return { labels, locationOptions };
  });

  protected get labels(): LocationType[] {
    return this.groupedLocations().labels;
  }

  protected get locationOptions(): Record<LocationType, LocationOption[]> {
    return this.groupedLocations().locationOptions;
  }
}
