import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../..//services/configService';
import { TeacherDataService } from '../../..//services/teacherDataService';
import { ComponentGradingComponent } from '../component-grading.component';
import { ComponentStateInfoComponent } from '../../../common/component-state-info/component-state-info.component';
import { EditComponentAnnotationsComponent } from '../edit-component-annotations/edit-component-annotations.component';
import { Observable } from 'rxjs';

@Component({
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    ComponentGradingComponent,
    ComponentStateInfoComponent,
    EditComponentAnnotationsComponent
  ],
  selector: 'view-component-revisions',
  styleUrl: 'view-component-revisions.component.scss',
  templateUrl: 'view-component-revisions.component.html'
})
export class ViewComponentRevisionsComponent {
  private annotationService = inject(AnnotationService);
  private configService = inject(ConfigService);
  data = inject(MAT_DIALOG_DATA);
  private dataService = inject(TeacherDataService);

  protected componentId: string;
  protected fromWorkgroupId: number;
  private increment: number = 5;
  protected nodeId: string;
  protected numRevisionsShown: number = 5;
  private revisions: any = {};
  protected revisionsSorted: any[];
  protected totalRevisions: number;
  protected usernames: string[];
  protected workgroupId: number;

  ngOnInit() {
    this.componentId = this.data.componentId;
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
      const nodeVisits = events.map((event) => ({
        serverSaveTime: event.serverSaveTime,
        states: []
      }));
      this.populateDataHelper(nodeVisits);
    });
  }

  private populateDataHelper(nodeVisits: any[]): void {
    // group all component states by node visit
    for (let i = this.data.componentStates.length - 1; i > -1; i--) {
      const componentState = this.data.componentStates[i];
      if (nodeVisits.length > 0) {
        // add state to corresponding node visit
        for (let j = nodeVisits.length - 1; j > -1; j--) {
          const nodeVisit = nodeVisits[j];
          if (componentState.serverSaveTime >= nodeVisit.serverSaveTime) {
            nodeVisit.states.push(componentState);
            break;
          }
        }
      } else {
        // we don't have any node visits, so count all all states as revisions.
        this.totalRevisions++;
        this.revisions[componentState.id] = {
          clientSaveTime: this.configService.convertToClientTimestamp(
            componentState.serverSaveTime
          ),
          componentState: componentState
        };
      }
    }

    // find revisions in each node visit and add to model
    nodeVisits.forEach((nodeVisit) => {
      nodeVisit.states
        .filter((state, index) => this.isRevision(state, index))
        .forEach((state) => {
          this.totalRevisions++;
          this.revisions[state.id] = {
            clientSaveTime: this.configService.convertToClientTimestamp(state.serverSaveTime),
            componentState: state
          };
        });
    });
    this.sortRevisions();
  }

  private isRevision(state: any, stateIndex: number): boolean {
    return (
      stateIndex === 0 ||
      state.isSubmit ||
      this.annotationService
        .getAnnotationsByStudentWorkId(state.id)
        .some((annotation) =>
          ['score', 'autoScore', 'comment', 'autoComment'].includes(annotation.type)
        )
    );
  }

  private sortRevisions(): void {
    this.revisionsSorted = Object.values(this.revisions).sort(
      (a: any, b: any) => b.clientSaveTime - a.clientSaveTime
    );
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

  protected showMore(): void {
    this.numRevisionsShown += this.increment;
  }
}
