import { PeerGrouping } from '../../../../app/domain/peerGrouping';
import { PeerGroupMember } from './PeerGroupMember';

export class PeerGroup {
  id: number;
  members: PeerGroupMember[];
  peerGrouping: PeerGrouping;
  periodId: number;

  constructor(id: number, members: PeerGroupMember[], peerGrouping: PeerGrouping) {
    this.id = id;
    this.members = members;
    this.peerGrouping = peerGrouping;
  }

  getWorkgroupIds(): number[] {
    return this.members.map((member) => member.id);
  }
}
