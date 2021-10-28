import { PeerGroupActivity } from './PeerGroupActivity';
import { PeerGroupMember } from './PeerGroupMember';

export class PeerGroup {
  id: number;
  members: PeerGroupMember[];
  peerGroupActivity: PeerGroupActivity;
}
