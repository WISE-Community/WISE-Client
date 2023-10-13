export const schoolLevels: SchoolLevel[] = [
  { code: 'ELEMENTARY_SCHOOL', label: $localize`Elementary School` },
  { code: 'MIDDLE_SCHOOL', label: $localize`Middle School` },
  { code: 'HIGH_SCHOOL', label: $localize`High School` },
  { code: 'COLLEGE', label: $localize`College` },
  { code: 'OTHER', label: $localize`Other` }
];

export interface SchoolLevel {
  code: string;
  label: string;
}
