import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeerGrouping } from '../../../app/domain/peerGrouping';
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

  getPeerGroupings(): PeerGrouping[] {
    return this.projectService.getPeerGroupings();
  }

  createNewPeerGrouping(newPeerGrouping: PeerGrouping): Observable<PeerGrouping> {
    this.createNewPeerGroupingInProject(newPeerGrouping);
    const runId = this.configService.getRunId();
    if (runId == null) {
      return this.getDummyObservable();
    } else {
      return this.createNewPeerGroupingInDatabase(newPeerGrouping);
    }
  }

  private getDummyObservable(): Observable<any> {
    return new Observable((observer) => {
      observer.next();
    });
  }

  private createNewPeerGroupingInProject(newPeerGrouping: PeerGrouping): void {
    const allPeerGrouping = this.getPeerGroupings();
    allPeerGrouping.push(newPeerGrouping);
    this.projectService.saveProject();
  }

  private createNewPeerGroupingInDatabase(newPeerGrouping: PeerGrouping): Observable<PeerGrouping> {
    const runId = this.configService.getRunId();
    return this.http.post<PeerGrouping>(`/api/run/${runId}/peer-grouping`, newPeerGrouping);
  }

  updatePeerGrouping(peerGroupingToUpdate: PeerGrouping): Observable<PeerGrouping> {
    this.updatePeerGroupingInProject(peerGroupingToUpdate);
    const runId = this.configService.getRunId();
    if (runId == null) {
      return this.getDummyObservable();
    } else {
      return this.updatePeerGroupingInDatabase(peerGroupingToUpdate);
    }
  }

  private updatePeerGroupingInProject(peerGroupingToUpdate: PeerGrouping): void {
    const allPeerGroupings = this.getPeerGroupings();
    for (let i = 0; i < allPeerGroupings.length; i++) {
      const peerGrouping = allPeerGroupings[i];
      if (peerGrouping.tag === peerGroupingToUpdate.tag) {
        allPeerGroupings[i] = peerGroupingToUpdate;
      }
    }
    this.projectService.saveProject();
  }

  private updatePeerGroupingInDatabase(
    peerGroupingToUpdate: PeerGrouping
  ): Observable<PeerGrouping> {
    const runId = this.configService.getRunId();
    return this.http.put<PeerGrouping>(
      `/api/run/${runId}/peer-grouping/${peerGroupingToUpdate.tag}`,
      peerGroupingToUpdate
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
    const allPeerGroupingTags = this.getAllPeerGroupingTags(this.getPeerGroupings());
    while (allPeerGroupingTags.includes(newTag)) {
      newTag = this.utilService.generateKey();
    }
    return newTag;
  }

  private getAllPeerGroupingTags(peerGrouping: PeerGrouping[]): string[] {
    return peerGrouping.map((peerGrouping) => peerGrouping.tag);
  }

  deletePeerGrouping(tag: string): void {
    const allPeerGroupings = this.getPeerGroupings();
    for (let i = 0; i < allPeerGroupings.length; i++) {
      const peerGrouping = allPeerGroupings[i];
      if (peerGrouping.tag === tag) {
        allPeerGroupings.splice(i, 1);
        break;
      }
    }
    this.projectService.saveProject();
  }

  getPeerGroupingName(tag: string): string {
    for (const peerGrouping of this.getPeerGroupings()) {
      if (peerGrouping.tag === tag) {
        return peerGrouping.name;
      }
    }
    return null;
  }
}
