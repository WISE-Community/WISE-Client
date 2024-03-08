import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnnotationService } from './annotationService';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { Observable, Subject, tap } from 'rxjs';
import { ProjectCompletion } from '../common/ProjectCompletion';
import { StudentStatus } from '../common/StudentStatus';
import { CompletionCounter } from '../common/CompletionCounter';

@Injectable()
export class ClassroomStatusService {
  studentStatuses = [];
  private studentStatusReceivedSource: Subject<any> = new Subject<any>();
  public studentStatusReceived$: Observable<any> = this.studentStatusReceivedSource.asObservable();

  constructor(
    private http: HttpClient,
    private annotationService: AnnotationService,
    private configService: ConfigService,
    private projectService: ProjectService
  ) {}

  retrieveStudentStatuses(): any {
    return this.http.get(`/api/teacher/run/${this.configService.getRunId()}/student-status`).pipe(
      tap((studentStatuses: any[]) => {
        this.studentStatuses = this.parseStudentStatuses(studentStatuses);
        return this.studentStatuses;
      })
    );
  }

  private parseStudentStatuses(studentStatuses: any[]): any[] {
    const parsedStatuses = [];
    const workgroups = this.configService.getClassmateUserInfos();
    for (const studentStatus of studentStatuses) {
      if (
        workgroups.find((workgroup) => {
          return workgroup.workgroupId === studentStatus.workgroupId;
        })
      ) {
        const parsedStatus = JSON.parse(studentStatus.status);
        parsedStatus.postTimestamp = studentStatus.timestamp;
        parsedStatuses.push(parsedStatus);
      }
    }
    return parsedStatuses;
  }

  getStudentStatuses() {
    return this.studentStatuses;
  }

  getCurrentNodeLocationForWorkgroupId(workgroupId: number): any {
    const studentStatus = this.getStudentStatusForWorkgroupId(workgroupId);
    if (studentStatus != null) {
      const currentNodeId = studentStatus.currentNodeId;
      return {
        position: this.projectService.getNodePositionAndTitle(currentNodeId),
        order: this.projectService.getNodeOrderById(currentNodeId)
      };
    }
    return null;
  }

  getStudentStatusForWorkgroupId(workgroupId: number): any {
    return (
      this.getStudentStatuses().find(
        (studentStatus) => studentStatus.workgroupId === workgroupId
      ) || null
    );
  }

  hasStudentStatus(workgroupId: number): boolean {
    return this.getStudentStatusForWorkgroupId(workgroupId) != null;
  }

  setStudentStatus(studentStatus: any): void {
    let isStudentStatusFound = false;
    const studentStatuses = this.getStudentStatuses();
    for (let x = 0; x < studentStatuses.length; x++) {
      const aStudentStatus = studentStatuses[x];
      if (aStudentStatus.workgroupId === studentStatus.workgroupId) {
        studentStatuses.splice(x, 1, studentStatus);
        isStudentStatusFound = true;
        break;
      }
    }
    if (!isStudentStatusFound) {
      studentStatuses.push(studentStatus);
    }
  }

  getStudentProjectCompletion(workgroupId: number): ProjectCompletion {
    let completion: ProjectCompletion = new ProjectCompletion();
    const studentStatus = this.getStudentStatusForWorkgroupId(workgroupId);
    if (studentStatus) {
      const projectCompletion = studentStatus.projectCompletion;
      const completionPctWithWork = projectCompletion.completionPctWithWork;
      if (completionPctWithWork) {
        completion.totalItems = projectCompletion.totalItemsWithWork;
        completion.completedItems = projectCompletion.completedItemsWithWork;
        completion.completionPct = projectCompletion.completionPctWithWork;
      } else {
        // we have a legacy projectCompletion object that only includes information for all nodes so
        // we need to calculate completion manually
        completion = this.getNodeCompletion('group0', -1, workgroupId, true);
      }
    }
    return completion;
  }

  /**
   * Get node completion data
   * @param nodeId the node id
   * @param periodId the period id (pass in -1 to select all periods)
   * @param workgroupId (optional) the workgroup id to limit results to
   * @param onlyIncludeWorkNodes (optional) boolean whether to only include work nodes
   * @returns object with completed, total, and percent completed (integer between 0 and 100)
   */
  getNodeCompletion(
    nodeId: string,
    periodId: number,
    workgroupId: number = null,
    onlyIncludeWorkNodes: boolean = false
  ): any {
    let numCompleted = 0;
    let numTotal = 0;
    const isGroupNode = this.projectService.isGroupNode(nodeId);
    const studentStatuses = this.getStudentStatusesForPeriodAndWorkgroup(periodId, workgroupId);
    for (const studentStatus of studentStatuses) {
      const nodeStatuses = studentStatus.nodeStatuses;
      const nodeStatus = nodeStatuses[nodeId];
      if (nodeStatus != null) {
        if (isGroupNode) {
          ({ numCompleted, numTotal } = this.addGroupNodeCompletion(
            nodeStatuses,
            nodeId,
            onlyIncludeWorkNodes,
            numCompleted,
            numTotal
          ));
        } else {
          ({ numCompleted, numTotal } = this.addStepNodeCompletion(
            nodeStatus,
            nodeId,
            onlyIncludeWorkNodes,
            numCompleted,
            numTotal
          ));
        }
      }
    }
    return this.getNodeCompletionResult(numCompleted, numTotal);
  }

  private getStudentStatusesForPeriodAndWorkgroup(
    periodId: number,
    workgroupId: number
  ): StudentStatus[] {
    return this.studentStatuses.filter(
      (studentStatus) =>
        this.periodMatches(studentStatus, periodId) &&
        this.workgroupMatches(studentStatus, workgroupId)
    );
  }

  private addGroupNodeCompletion(
    nodeStatuses: any,
    nodeId: string,
    onlyIncludeWorkNodes: boolean,
    numCompleted: number,
    numTotal: number
  ): CompletionCounter {
    const progress = nodeStatuses[nodeId].progress;
    if (onlyIncludeWorkNodes) {
      ({ numTotal, numCompleted } = this.getWorkNodeCompletion(
        progress,
        nodeStatuses,
        nodeId,
        numCompleted,
        numTotal
      ));
    } else if (progress) {
      numTotal += progress.totalItems;
      numCompleted += progress.completedItems;
    }
    return { numCompleted, numTotal };
  }

  private getWorkNodeCompletion(
    progress: any,
    nodeStatuses: any,
    nodeId: string,
    numCompleted: number,
    numTotal: number
  ): CompletionCounter {
    if (progress && progress.totalItemsWithWork) {
      numCompleted += progress.completedItemsWithWork;
      numTotal += progress.totalItemsWithWork;
    } else {
      // we have a legacy nodeStatus.progress that only includes completion information for all
      // nodes so we need to calculate the completion manually
      ({ numCompleted, numTotal } = this.calculateLegacyGroupCompletion(
        nodeStatuses,
        nodeId,
        numCompleted,
        numTotal
      ));
    }
    return { numCompleted, numTotal };
  }

  private addStepNodeCompletion(
    nodeStatus: any,
    nodeId: string,
    onlyIncludeWorkNodes: boolean,
    numCompleted: number,
    numTotal: number
  ): CompletionCounter {
    if (this.isIncludeStepStatusInCount(nodeStatus, nodeId, onlyIncludeWorkNodes)) {
      numTotal++;
      if (nodeStatus.isCompleted) {
        numCompleted++;
      }
    }
    return { numCompleted, numTotal };
  }

  private periodMatches(studentStatus: any, periodId: number): boolean {
    return periodId === -1 || periodId === studentStatus.periodId;
  }

  private workgroupMatches(studentStatus: any, workgroupId: number): boolean {
    return !workgroupId || workgroupId === studentStatus.workgroupId;
  }

  private calculateLegacyGroupCompletion(
    nodeStatuses: any,
    nodeId: string,
    numCompleted: number,
    numTotal: number
  ): CompletionCounter {
    for (const descendantId of this.getDescendantStepIds(nodeId)) {
      const descendantStatus = nodeStatuses[descendantId];
      if (this.isVisibleAndHasWork(descendantStatus, descendantId)) {
        if (descendantStatus.isCompleted) {
          numCompleted++;
        }
        numTotal++;
      }
    }
    return { numCompleted, numTotal };
  }

  private getDescendantStepIds(nodeId: string): string[] {
    const group = this.projectService.getNodeById(nodeId);
    return this.projectService
      .getDescendentIdsOfGroup(group)
      .filter((descendantId) => !this.projectService.isGroupNode(descendantId));
  }

  private isVisibleAndHasWork(nodeStatus: any, nodeId: string): boolean {
    return nodeStatus && nodeStatus.isVisible && this.projectService.nodeHasWork(nodeId);
  }

  private isIncludeStepStatusInCount(
    nodeStatus: any,
    nodeId: string,
    onlyIncludeWorkNodes: boolean
  ): boolean {
    return (
      nodeStatus.isVisible && (!onlyIncludeWorkNodes || this.projectService.nodeHasWork(nodeId))
    );
  }

  private getNodeCompletionResult(numCompleted: number, numTotal: number): any {
    const completionPercentage = numTotal > 0 ? Math.round((100 * numCompleted) / numTotal) : 0;
    return {
      completedItems: numCompleted,
      totalItems: numTotal,
      completionPct: completionPercentage
    };
  }

  /**
   * Get the average score for a node for a period
   * @param nodeId the node id
   * @param periodId the period id. pass in -1 to select all periods.
   * @returns the average score for the node for the period
   */
  getNodeAverageScore(nodeId, periodId) {
    let studentScoreSum = 0;
    let numStudentsWithScore = 0;
    const studentStatuses = this.studentStatuses;

    for (const studentStatus of studentStatuses) {
      if (studentStatus != null) {
        if (periodId === -1 || periodId === studentStatus.periodId) {
          // the period matches the one we are looking for
          const workgroupId = studentStatus.workgroupId;

          // get the workgroups score on the node
          const score = this.annotationService.getTotalNodeScoreForWorkgroup(workgroupId, nodeId);

          if (score != null) {
            // increment the counter of students with a score for this node
            numStudentsWithScore++;

            // accumulate the sum of the scores for this node
            studentScoreSum += score;
          }
        }
      }
    }

    let averageScore = null;

    if (numStudentsWithScore !== 0) {
      // calculate the average score for this node rounded down to the nearest hundredth
      averageScore = Math.floor((100 * studentScoreSum) / numStudentsWithScore) / 100;
    }

    return averageScore;
  }

  /**
   * Get the max score for the project for the given workgroup id
   * @param workgroupId
   * @returns the sum of the max scores for all the nodes in the project visible
   * to the given workgroupId or null if none of the visible components has max scores.
   */
  getMaxScoreForWorkgroupId(workgroupId) {
    let maxScore = null;
    let studentStatus = this.getStudentStatusForWorkgroupId(workgroupId);
    if (studentStatus) {
      let nodeStatuses = studentStatus.nodeStatuses;
      if (nodeStatuses) {
        for (let p in nodeStatuses) {
          if (nodeStatuses.hasOwnProperty(p)) {
            let nodeStatus = nodeStatuses[p];
            let nodeId = nodeStatus.nodeId;
            if (nodeStatus.isVisible && this.projectService.isApplicationNode(nodeId)) {
              let nodeMaxScore = this.projectService.getMaxScoreForNode(nodeId);
              if (nodeMaxScore) {
                // there is a max score for the node, so add to total
                // TODO geoffreykwan: trying to add to null?
                maxScore += nodeMaxScore;
              }
            }
          }
        }
      }
    }
    return maxScore;
  }

  broadcastStudentStatusReceived(args: any) {
    this.studentStatusReceivedSource.next(args);
  }
}
