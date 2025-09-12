export type LocationType = 'level1' | 'level2' | 'level3';

export const locationTypeToLabel: { [key in LocationType]: string } = {
  level3: $localize`Locale`,
  level2: $localize`State`,
  level1: $localize`Country`
};

export class LocationOption {
  name: string;
  type: LocationType;
  constructor(type: LocationType, name: string) {
    this.type = type;
    this.name = name;
  }
}

// Represents a geographical location associated with a project
export class Location {
  id: string = '';
  level1: string = ''; // country
  level2: string = ''; // state
  level3: string = ''; // city, county, or other locale

  getLocationOptions(): LocationOption[] {
    const options = [];
    if (this.level1) {
      options.push(new LocationOption('level1', this.level1));
    }
    if (this.level2) {
      options.push(new LocationOption('level2', `${this.level2}, ${this.level1}`));
    }
    if (this.level3) {
      options.push(new LocationOption('level3', `${this.level3}, ${this.level2}, ${this.level1}`));
    }
    return options;
  }
}
