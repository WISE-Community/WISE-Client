import { ComponentContent } from '../../common/ComponentContent';

export interface MatchContent extends ComponentContent {
  buckets: any[];
  canCreateChoices: boolean;
  choices: any[];
}
