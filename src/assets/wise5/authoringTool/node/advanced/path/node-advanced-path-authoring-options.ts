export const canChangePathOptions = [
  { value: true, text: $localize`True` },
  { value: false, text: $localize`False` }
];

export const howToChooseAmongAvailablePathsOptions = [
  { value: 'random', text: $localize`Random` },
  { value: 'workgroupId', text: $localize`Workgroup ID` },
  { value: 'firstAvailable', text: $localize`First Available` },
  { value: 'lastAvailable', text: $localize`Last Available` },
  { value: 'tag', text: $localize`Tag` }
];

export const transitionCriterias = [
  {
    value: 'score',
    text: $localize`Get a specific score on a component`,
    params: [
      { value: 'nodeId', text: $localize`Node ID` },
      { value: 'componentId', text: $localize`Component ID` },
      { value: 'scores', text: $localize`Scores(s)` },
      { value: 'scoreId', text: $localize`Score ID (Optional)` }
    ]
  },
  {
    value: 'choiceChosen',
    text: $localize`Choose a specific choice on a component`,
    params: [
      { value: 'nodeId', text: $localize`Node ID` },
      { value: 'componentId', text: $localize`Component ID` },
      { value: 'choiceIds', text: $localize`Choices` }
    ]
  },
  {
    value: 'tag',
    text: $localize`Have Tag Assigned To Workgroup`,
    params: [{ value: 'tag', text: $localize`Tag` }]
  }
];

export const whenToChoosePathOptions = [
  { value: 'enterNode', text: $localize`Enter Node` },
  { value: 'exitNode', text: $localize`Exit Node` },
  { value: 'scoreChanged', text: $localize`Score Changed` },
  { value: 'studentDataChanged', text: $localize`Student Data Changed` }
];
