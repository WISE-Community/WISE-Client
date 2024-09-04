export const CHOICE_CHOSEN_VALUE = 'choiceChosen';
export const RANDOM_VALUE = 'random';
export const SCORE_VALUE = 'score';
export const WORKGROUP_ID_VALUE = 'workgroupId';

export interface BranchCriteria {
  text: string;
  value: string;
}

export const BRANCH_CRITERIA: BranchCriteria[] = [
  {
    text: $localize`Workgroup ID`,
    value: WORKGROUP_ID_VALUE
  },
  {
    text: $localize`Score`,
    value: SCORE_VALUE
  },
  {
    text: $localize`Choice Chosen`,
    value: CHOICE_CHOSEN_VALUE
  },
  {
    text: $localize`Random`,
    value: RANDOM_VALUE
  }
];
