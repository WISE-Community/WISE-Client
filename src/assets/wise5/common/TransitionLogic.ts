import { Transition } from './Transition';

export interface TransitionLogic {
  canChangePath?: boolean;
  howToChooseAmongAvailablePaths?: string;
  transitions: Transition[];
  whenToChoosePath?: string;
}
