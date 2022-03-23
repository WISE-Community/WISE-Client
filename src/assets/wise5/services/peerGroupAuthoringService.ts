import { Injectable } from '@angular/core';
import { PeerGroupSettings } from '../authoringTool/peer-group/peerGroupSettings';
import { TeacherProjectService } from './teacherProjectService';
import { UtilService } from './utilService';

@Injectable()
export class PeerGroupAuthoringService {
  constructor(private projectService: TeacherProjectService, private utilService: UtilService) {}

  getPeerGroupSettings(): PeerGroupSettings[] {
    const peerGroupSettings = this.projectService.getPeerGroupSettings();
    return peerGroupSettings ? peerGroupSettings : [];
  }

  createNewPeerGroupSettings(newPeerGroupSettings: PeerGroupSettings): void {
    const allPeerGroupSettings = this.getPeerGroupSettings();
    allPeerGroupSettings.push(newPeerGroupSettings);
    this.projectService.saveProject();
  }

  updatePeerGroupSettings(peerGroupSettingsToUpdate: PeerGroupSettings): void {
    const allPeerGroupSettings = this.getPeerGroupSettings();
    for (let i = 0; i < allPeerGroupSettings.length; i++) {
      const peerGroupSettings = allPeerGroupSettings[i];
      if (peerGroupSettings.tag === peerGroupSettingsToUpdate.tag) {
        allPeerGroupSettings[i] = peerGroupSettingsToUpdate;
      }
    }
    this.projectService.saveProject();
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

  getUniqueTag(): string {
    let newTag = this.utilService.generateKey();
    const allPeerGroupTags = this.getAllPeerGroupTags(this.getPeerGroupSettings());
    while (allPeerGroupTags.includes(newTag)) {
      newTag = this.utilService.generateKey();
    }
    return newTag;
  }

  getAllPeerGroupTags(peerGroupSettings: PeerGroupSettings[]): string[] {
    return peerGroupSettings.map((peerGroupSettings) => peerGroupSettings.tag);
  }
}
