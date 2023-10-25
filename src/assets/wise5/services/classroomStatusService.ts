import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnnotationService } from './annotationService';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { Observable, Subject, tap } from 'rxjs';
import { NodeProgress } from '../common/NodeProgress';
import { ProjectCompletion } from '../common/ProjectCompletion';

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

  /**
   * Get the current node position and title for a workgroup
   * e.g. 2.2: Newton Scooter Concepts
   * @param workgroupId the workgroup id
   * @returns the node position and title
   */
  getCurrentNodePositionAndNodeTitleForWorkgroupId(workgroupId) {
    const studentStatus = this.getStudentStatusForWorkgroupId(workgroupId);
    if (studentStatus != null) {
      const currentNodeId = studentStatus.currentNodeId;
      return this.projectService.getNodePositionAndTitle(currentNodeId);
    }
    return null;
  }

  getStudentStatusForWorkgroupId0(workgroupId: number): any {
    const studentStatuses = this.getStudentStatuses();
    for (let tempStudentStatus of studentStatuses) {
      if (tempStudentStatus != null) {
        const tempWorkgroupId = tempStudentStatus.workgroupId;
        if (workgroupId === tempWorkgroupId) {
          return tempStudentStatus;
        }
      }
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
   * Get node completion info for the given parameters
   * @param nodeId the node id
   * @param periodId the period id (pass in -1 to select all periods)
   * @param workgroupId the workgroup id to limit results to (optional)
   * @param excludeNonWorkNodes boolean whether to exclude nodes without
   * student work or not (optional)
   * @returns object with completed, total, and percent completed (integer
   * between 0 and 100).
   */
  getNodeCompletion(nodeId, periodId, workgroupId = null, excludeNonWorkNodes = false) {
    let numCompleted = 0;
    let numTotal = 0;
    let isGroupNode = this.projectService.isGroupNode(nodeId);

    let studentStatuses = this.studentStatuses;
    for (let studentStatus of studentStatuses) {
      if (studentStatus) {
        if (periodId === -1 || periodId === studentStatus.periodId) {
          if (!workgroupId || workgroupId === studentStatus.workgroupId) {
            let nodeStatuses = studentStatus.nodeStatuses;
            if (nodeStatuses) {
              let nodeStatus = nodeStatuses[nodeId];
              if (nodeStatus != null) {
                if (isGroupNode) {
                  let progress = nodeStatus.progress;
                  if (excludeNonWorkNodes) {
                    // we're looking for only nodes with student work
                    if (progress && progress.totalItemsWithWork) {
                      numTotal += progress.totalItemsWithWork;
                      numCompleted += progress.completedItemsWithWork;
                    } else {
                      /*
                       * we have a legacy nodeStatus.progress that only includes completion information for all nodes
                       * so we need to calculate manually
                       */
                      let group = this.projectService.getNodeById(nodeId);

                      let descendants = this.projectService.getDescendentsOfGroup(group);

                      for (let descendantId of descendants) {
                        if (!this.projectService.isGroupNode(descendantId)) {
                          let descendantStatus = nodeStatuses[descendantId];

                          if (
                            descendantStatus &&
                            descendantStatus.isVisible &&
                            this.projectService.nodeHasWork(descendantId)
                          ) {
                            numTotal++;

                            if (descendantStatus.isCompleted) {
                              numCompleted++;
                            }
                          }
                        }
                      }
                    }
                  } else {
                    // we're looking for completion percentage of all nodes
                    if (progress) {
                      numTotal += progress.totalItems;
                      numCompleted += progress.completedItems;
                    }
                  }
                } else {
                  // given node is not a group
                  if (nodeStatus.isVisible) {
                    /*
                     * the student can see the step. we need this check
                     * for cases when a project has branching. this way
                     * we only calculate the step completion percentage
                     * based on the students that can actually go to
                     * the step.
                     */

                    /*
                     * check whether we should include the node in the calculation
                     * i.e. either includeNonWorkNodes is true or the node has student work
                     */
                    let includeNode =
                      !excludeNonWorkNodes || this.projectService.nodeHasWork(nodeId);

                    if (includeNode) {
                      numTotal++;

                      if (nodeStatus.isCompleted) {
                        // the student has completed the node
                        numCompleted++;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // generate the percentage number rounded down to the nearest integer
    let completionPercentage = numTotal > 0 ? Math.round((100 * numCompleted) / numTotal) : 0;

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
