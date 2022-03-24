import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeerGroupSettings } from '../authoringTool/peer-group/peerGroupSettings';
import { ConfigService } from './configService';
import { TeacherProjectService } from './teacherProjectService';
import { UtilService } from './utilService';

@Injectable()
export class PeerGroupAuthoringService {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private projectService: TeacherProjectService,
    private utilService: UtilService
  ) {}

  getPeerGroupSettings(): PeerGroupSettings[] {
    const peerGroupSettings = this.projectService.getPeerGroupSettings();
    return peerGroupSettings ? peerGroupSettings : [];
  }

  createNewPeerGroupSettings(
    newPeerGroupSettings: PeerGroupSettings
  ): Observable<PeerGroupSettings> {
    const allPeerGroupSettings = this.getPeerGroupSettings();
    allPeerGroupSettings.push(newPeerGroupSettings);
    this.projectService.saveProject();
    const runId = this.configService.getRunId();
    return this.http.post<PeerGroupSettings>(
      `/api/run/${runId}/peer-group-settings`,
      newPeerGroupSettings
    );
  }

  updatePeerGroupSettings(
    peerGroupSettingsToUpdate: PeerGroupSettings
  ): Observable<PeerGroupSettings> {
    const allPeerGroupSettings = this.getPeerGroupSettings();
    for (let i = 0; i < allPeerGroupSettings.length; i++) {
      const peerGroupSettings = allPeerGroupSettings[i];
      if (peerGroupSettings.tag === peerGroupSettingsToUpdate.tag) {
        allPeerGroupSettings[i] = peerGroupSettingsToUpdate;
      }
    }
    this.projectService.saveProject();
    const runId = this.configService.getRunId();
    return this.http.put<PeerGroupSettings>(
      `/api/run/${runId}/peer-group-settings/${peerGroupSettingsToUpdate.tag}`,
      peerGroupSettingsToUpdate
    );
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

  deletePeerGroupSettings(tag: string): void {
    const allPeerGroupSettings = this.getPeerGroupSettings();
    for (let i = 0; i < allPeerGroupSettings.length; i++) {
      const peerGroupSettings = allPeerGroupSettings[i];
      if (peerGroupSettings.tag === tag) {
        allPeerGroupSettings.splice(i, 1);
        break;
      }
    }
    this.projectService.saveProject();
  }
}
