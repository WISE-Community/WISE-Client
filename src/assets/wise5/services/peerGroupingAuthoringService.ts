import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PeerGrouping } from '../../../app/domain/peerGrouping';
import { generateRandomKey } from '../common/string/string';
import { ConfigService } from './configService';
import { TeacherProjectService } from './teacherProjectService';

@Injectable()
export class PeerGroupingAuthoringService {
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private projectService: TeacherProjectService
  ) {}

  getPeerGroupings(): PeerGrouping[] {
    return this.projectService.getPeerGroupings();
  }

  createNewPeerGrouping(newPeerGrouping: PeerGrouping): Observable<PeerGrouping> {
    const runId = this.configService.getRunId();
    if (runId == null) {
      return this.getDummyObservable().pipe(
        tap(() => {
          this.createNewPeerGroupingInProject(newPeerGrouping);
        })
      );
    } else {
      return this.createNewPeerGroupingOnServer(newPeerGrouping);
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

  private createNewPeerGroupingOnServer(newPeerGrouping: PeerGrouping): Observable<PeerGrouping> {
    const runId = this.configService.getRunId();
    return this.http.post<PeerGrouping>(`/api/run/${runId}/peer-grouping`, newPeerGrouping).pipe(
      tap(() => {
        this.createNewPeerGroupingInProject(newPeerGrouping);
      })
    );
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
        Object.assign(allPeerGroupings[i], peerGroupingToUpdate);
        break;
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
          stepsUsedIn.push(this.projectService.getNodePositionAndTitle(node.id));
          break;
        }
      }
    }
    return stepsUsedIn;
  }

  getUniqueTag(): string {
    let newTag = generateRandomKey();
    const allPeerGroupingTags = this.getAllPeerGroupingTags(this.getPeerGroupings());
    while (allPeerGroupingTags.includes(newTag)) {
      newTag = generateRandomKey();
    }
    return newTag;
  }

  private getAllPeerGroupingTags(peerGrouping: PeerGrouping[]): string[] {
    return peerGrouping.map((peerGrouping) => peerGrouping.tag);
  }

  deletePeerGrouping(peerGroupingToDelete: PeerGrouping): void {
    const allPeerGroupings = this.getPeerGroupings();
    for (let i = 0; i < allPeerGroupings.length; i++) {
      const peerGrouping = allPeerGroupings[i];
      if (peerGrouping.tag === peerGroupingToDelete.tag) {
        allPeerGroupings.splice(i, 1);
        break;
      }
    }
    this.projectService.saveProject();
  }

  getPeerGrouping(tag: string): PeerGrouping {
    return this.getPeerGroupings().find((peerGrouping: PeerGrouping) => {
      return peerGrouping.tag === tag;
    });
  }
}
