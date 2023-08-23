import { Component, Inject } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'view-component-revisions.component',
  styleUrls: ['view-component-revisions.component.scss'],
  templateUrl: 'view-component-revisions.component.html'
})
export class ViewComponentRevisionsComponent {
  componentId: string;
  componentStates: any = [];
  fromWorkgroupId: number;
  increment: number = 5;
  nodeId: string;
  numRevisionsShown: number = 5;
  revisions: any = {};
  revisionsSorted: any[];
  totalRevisions: number;
  usernames: string[];
  workgroupId: number;

  constructor(
    private annotationService: AnnotationService,
    private configService: ConfigService,
    private dataService: TeacherDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.componentId = this.data.componentId;
    this.componentStates = this.data.componentStates;
    this.fromWorkgroupId = this.data.fromWorkgroupId;
    this.nodeId = this.data.nodeId;
    this.workgroupId = this.data.workgroupId;
    this.usernames = this.configService.getDisplayNamesByWorkgroupId(this.workgroupId);
    this.populateData();
  }

  /**
   * Set the revisions for this workgroup and component.
   * A component state counts as a revision if it is a submit, has an annotation associated
   * with it, or is the last component state for a node visit.
   */
  private populateData(): void {
    this.revisions = {};
    this.totalRevisions = 0;
    this.getNodeEnteredEvents().subscribe(({ events }) => {
      const nodeVisits = events.map((event) => {
        return {
          serverSaveTime: event.serverSaveTime,
          states: []
        };
      });
      this.populateDataHelper(nodeVisits);
    });
  }

  populateDataHelper(nodeVisits: any[]) {
    // group all component states by node visit
    for (let cStatesIndex = this.componentStates.length - 1; cStatesIndex > -1; cStatesIndex--) {
      const componentState = this.componentStates[cStatesIndex];
      if (nodeVisits.length > 0) {
        // add state to corresponding node visit
        for (let nVisitsIndex = nodeVisits.length - 1; nVisitsIndex > -1; nVisitsIndex--) {
          const nodeVisit = nodeVisits[nVisitsIndex];
          if (componentState.serverSaveTime >= nodeVisit.serverSaveTime) {
            nodeVisit.states.push(componentState);
            break;
          }
        }
      } else {
        // we don't have any node visits, so count all all states as revisions.
        this.totalRevisions++;
        this.revisions[componentState.id] = {
          clientSaveTime: this.convertToClientTimestamp(componentState.serverSaveTime),
          componentState: componentState
        };
      }
    }

    // find revisions in each node visit and add to model
    for (let visitsIndex = 0; visitsIndex < nodeVisits.length; visitsIndex++) {
      const states = nodeVisits[visitsIndex].states;
      for (let i = 0; i < states.length; i++) {
        const state = states[i];
        let isRevision = false;
        if (i === 0) {
          isRevision = true; // latest state for a visit always counts as a revision
        } else if (state.isSubmit) {
          isRevision = true;
        } else {
          for (const annotation of this.annotationService.getAnnotationsByStudentWorkId(state.id)) {
            if (['score', 'autoScore', 'comment', 'autoComment'].includes(annotation.type)) {
              isRevision = true; // is revision if there is an annotation for the component
              break;
            }
          }
        }
        if (isRevision) {
          this.totalRevisions++;
          this.revisions[state.id] = {
            clientSaveTime: this.convertToClientTimestamp(state.serverSaveTime),
            componentState: state
          };
        }
      }
    }
    this.sortRevisions();
  }

  sortRevisions() {
    this.revisionsSorted = Object.values(this.revisions).sort((a: any, b: any) => {
      return b.clientSaveTime - a.clientSaveTime;
    });
  }

  private getNodeEnteredEvents(): Observable<any> {
    return this.dataService.retrieveStudentData({
      getAnnotations: false,
      getEvents: true,
      getStudentWork: false,
      event: 'nodeEntered',
      nodeId: this.nodeId,
      workgroupId: this.workgroupId,
      runId: this.configService.getRunId()
    });
  }

  convertToClientTimestamp(time: number) {
    return this.configService.convertToClientTimestamp(time);
  }

  showMore() {
    this.numRevisionsShown += this.increment;
  }
}
