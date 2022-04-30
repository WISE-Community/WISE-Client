import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeerGroupingSettings } from '../authoringTool/peer-grouping/peerGroupingSettings';
import { ConfigService } from './configService';
import { TeacherProjectService } from './teacherProjectService';
import { UtilService } from './utilService';

@Injectable()
export class PeerGroupingAuthoringService {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private projectService: TeacherProjectService,
    private utilService: UtilService
  ) {}

  getPeerGroupingSettings(): PeerGroupingSettings[] {
    return this.projectService.getPeerGroupingSettings();
  }

  createNewPeerGroupingSettings(
    newPeerGroupingSettings: PeerGroupingSettings
  ): Observable<PeerGroupingSettings> {
    this.createNewPeerGroupingSettingsInProject(newPeerGroupingSettings);
    const runId = this.configService.getRunId();
    if (runId == null) {
      return this.getDummyObservable();
    } else {
      return this.createNewPeerGroupingSettingsInDatabase(newPeerGroupingSettings);
    }
  }

  private getDummyObservable(): Observable<any> {
    return new Observable((observer) => {
      observer.next();
    });
  }

  private createNewPeerGroupingSettingsInProject(
    newPeerGroupingSettings: PeerGroupingSettings
  ): void {
    const allPeerGroupingSettings = this.getPeerGroupingSettings();
    allPeerGroupingSettings.push(newPeerGroupingSettings);
    this.projectService.saveProject();
  }

  private createNewPeerGroupingSettingsInDatabase(
    newPeerGroupingSettings: PeerGroupingSettings
  ): Observable<PeerGroupingSettings> {
    const runId = this.configService.getRunId();
    return this.http.post<PeerGroupingSettings>(
      `/api/run/${runId}/peer-grouping`,
      newPeerGroupingSettings
    );
  }

  updatePeerGroupingSettings(
    peerGroupingSettingsToUpdate: PeerGroupingSettings
  ): Observable<PeerGroupingSettings> {
    this.updatePeerGroupingSettingsInProject(peerGroupingSettingsToUpdate);
    const runId = this.configService.getRunId();
    if (runId == null) {
      return this.getDummyObservable();
    } else {
      return this.updatePeerGroupingSettingsInDatabase(peerGroupingSettingsToUpdate);
    }
  }

  private updatePeerGroupingSettingsInProject(
    peerGroupingSettingsToUpdate: PeerGroupingSettings
  ): void {
    const allPeerGroupingSettings = this.getPeerGroupingSettings();
    for (let i = 0; i < allPeerGroupingSettings.length; i++) {
      const peerGroupingSettings = allPeerGroupingSettings[i];
      if (peerGroupingSettings.tag === peerGroupingSettingsToUpdate.tag) {
        allPeerGroupingSettings[i] = peerGroupingSettingsToUpdate;
      }
    }
    this.projectService.saveProject();
  }

  private updatePeerGroupingSettingsInDatabase(
    peerGroupingSettingsToUpdate: PeerGroupingSettings
  ): Observable<PeerGroupingSettings> {
    const runId = this.configService.getRunId();
    return this.http.put<PeerGroupingSettings>(
      `/api/run/${runId}/peer-grouping/${peerGroupingSettingsToUpdate.tag}`,
      peerGroupingSettingsToUpdate
    );
  }

  getStepsUsedIn(peerGroupingTag: string): string[] {
    const stepsUsedIn = [];
    for (const node of this.projectService.getApplicationNodes()) {
      for (const component of node.components) {
        if (component.peerGroupingTag === peerGroupingTag) {
          stepsUsedIn.push(this.projectService.getNodePositionAndTitleByNodeId(node.id));
          break;
        }
      }
    }
    return stepsUsedIn;
  }

  getUniqueTag(): string {
    let newTag = this.utilService.generateKey();
    const allPeerGroupingTags = this.getAllPeerGroupingTags(this.getPeerGroupingSettings());
    while (allPeerGroupingTags.includes(newTag)) {
      newTag = this.utilService.generateKey();
    }
    return newTag;
  }

  private getAllPeerGroupingTags(peerGroupingSettings: PeerGroupingSettings[]): string[] {
    return peerGroupingSettings.map((peerGroupingSettings) => peerGroupingSettings.tag);
  }

  deletePeerGroupingSettings(tag: string): void {
    const allPeerGroupingSettings = this.getPeerGroupingSettings();
    for (let i = 0; i < allPeerGroupingSettings.length; i++) {
      const peerGroupingSettings = allPeerGroupingSettings[i];
      if (peerGroupingSettings.tag === tag) {
        allPeerGroupingSettings.splice(i, 1);
        break;
      }
    }
    this.projectService.saveProject();
  }

  getPeerGroupingSettingsName(tag: string): string {
    for (const peerGroupingSettings of this.getPeerGroupingSettings()) {
      if (peerGroupingSettings.tag === tag) {
        return peerGroupingSettings.name;
      }
    }
    return null;
  }
}
