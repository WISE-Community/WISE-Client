import { Injectable } from '@angular/core';
import { PeerGroupSettings } from '../authoringTool/peer-group/peerGroupSettings';
import { ProjectService } from './projectService';

@Injectable()
export class PeerGroupAuthoringService {
  constructor(private projectService: ProjectService) {}

  getPeerGroupSettings(): PeerGroupSettings[] {
    const peerGroupSettings = this.projectService.getPeerGroupSettings();
    return peerGroupSettings ? peerGroupSettings : [];
  }

  createNewPeerGroupSettings(): void {
    //
  }

  updatePeerGroupSettings(peerGroupSettings: PeerGroupSettings): void {
    //
  }

  getStepsUsedIn(peerGroupTag: string): string[] {
    const stepsUsedIn = [];
    for (const node of this.projectService.getApplicationNodes()) {
      for (const component of node.components) {
        if (component.peerGroupActivityTag === peerGroupTag) {
          stepsUsedIn.push(this.projectService.getNodePositionAndTitleByNodeId(node.id));
          break;
        }
      }
    }
    return stepsUsedIn;
  }
}
