export interface PeerGroupingLogic {
  name: string;
  value: string;
}

export const DIFFERENT_IDEAS_NAME = $localize`Different Ideas`;
export const DIFFERENT_IDEAS_REGEX = /differentIdeas\("(\w+)",\s*"(\w+)"?"(,\s*")?(\w+)?(")?\)/g;
export const DIFFERENT_IDEAS_VALUE = 'differentIdeas';
export const DIFFERENT_SCORES_NAME = $localize`Different Scores`;
export const DIFFERENT_SCORES_REGEX = /differentKIScores\("(\w+)",\s*"(\w+)?"(,\s*")?(\w+)?(")?\)/g;
export const DIFFERENT_SCORES_VALUE = 'differentKIScores';

export const AVAILABLE_LOGIC: PeerGroupingLogic[] = [
  { name: $localize`Random`, value: 'random' },
  { name: $localize`Manual`, value: 'manual' },
  { name: DIFFERENT_IDEAS_NAME, value: DIFFERENT_IDEAS_VALUE },
  { name: DIFFERENT_SCORES_NAME, value: DIFFERENT_SCORES_VALUE }
];

export const AVAILABLE_MODES: any[] = [
  { name: $localize`Any`, value: 'any' },
  { name: $localize`Maximize`, value: 'maximize' }
];
