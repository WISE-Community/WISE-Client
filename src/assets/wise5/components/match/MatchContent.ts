import { ComponentContent } from '../../common/ComponentContent';
import { Choice } from './choice';

export interface MatchContent extends ComponentContent {
  buckets: any[];
  canCreateChoices: boolean;
  choices: Choice[];
  feedback: any[];
  ordered: boolean;
}
