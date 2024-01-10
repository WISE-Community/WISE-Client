import { Response } from '../Response';
import { TermEvaluator } from './TermEvaluator';

export class IsLowestWorkgroupIdInPeerGroupTermEvaluator extends TermEvaluator {
  evaluate(response: Response | Response[]): boolean {
    return this.peerGroup.getWorkgroupIds().sort().at(0) === this.configService.getWorkgroupId();
  }
}
