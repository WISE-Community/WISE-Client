export interface PeerGroupingLogic {
  name: string;
  value: string;
}

export const availableLogic: PeerGroupingLogic[] = [
  { name: $localize`Random`, value: 'random' },
  { name: $localize`Manual`, value: 'manual' }
];
