import { PeerGrouping } from '../../../../../../app/domain/peerGrouping';
import { PeerGroup } from '../../../peerChat/PeerGroup';
import { PeerGroupMember } from '../../../peerChat/PeerGroupMember';
import { CRaterResponse } from '../../cRater/CRaterResponse';
import { IsLowestWorkgroupIdInPeerGroupTermEvaluator } from './IsLowestWorkgroupIdInPeerGroupTermEvaluator';

class ConfigService {
  getWorkgroupId() {
    return 1;
  }
}

describe('IsLowestWorkgroupIdInPeerGroupTermEvaluator', () => {
  let evaluator, mockConfigService;
  beforeEach(() => {
    evaluator = new IsLowestWorkgroupIdInPeerGroupTermEvaluator('isLowestWorkgroupIdInPeerGroup');
    mockConfigService = new ConfigService();
    evaluator.setConfigService(mockConfigService);
    evaluator.setPeerGroup(
      new PeerGroup(1, [{ id: 1 }, { id: 2 }] as PeerGroupMember[], new PeerGrouping())
    );
  });
  describe('evaluate()', () => {
    [
      {
        description: 'your workgroup id is the lowest',
        myWorkgroupId: 1,
        expected: true
      },
      {
        description: 'your workgroup id is not the lowest',
        myWorkgroupId: 2,
        expected: false
      }
    ].forEach(({ description, myWorkgroupId, expected }) => {
      describe(description, () => {
        beforeEach(() => {
          spyOn(mockConfigService, 'getWorkgroupId').and.returnValue(myWorkgroupId);
        });
        it(`returns ${expected}`, () => {
          expect(evaluator.evaluate(new CRaterResponse())).toEqual(expected);
        });
      });
    });
  });
});
