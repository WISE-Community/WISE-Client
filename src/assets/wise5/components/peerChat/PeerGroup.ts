import { PeerGroupActivity } from './PeerGroupActivity';
import { PeerGroupMember } from './PeerGroupMember';

export class PeerGroup {
  id: number;
  members: PeerGroupMember[];
  peerGroupActivity: PeerGroupActivity;
  periodId: number;

  constructor(id: number, members: PeerGroupMember[], peerGroupActivity: PeerGroupActivity) {
    this.id = id;
    this.members = members;
    this.peerGroupActivity = peerGroupActivity;
  }
}
