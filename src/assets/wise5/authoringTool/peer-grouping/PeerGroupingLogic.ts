export interface PeerGroupingLogic {
  name: string;
  value: string;
}

export const DIFFERENT_IDEAS_NAME = $localize`Different Ideas`;
export const DIFFERENT_IDEAS_REGEX = /differentIdeas\("(\w+)",\s*"(\w+)"\)/g;
export const DIFFERENT_IDEAS_VALUE = 'differentIdeas';

export const AVAILABLE_LOGIC: PeerGroupingLogic[] = [
  { name: $localize`Random`, value: 'random' },
  { name: $localize`Manual`, value: 'manual' },
  { name: DIFFERENT_IDEAS_NAME, value: DIFFERENT_IDEAS_VALUE }
];
