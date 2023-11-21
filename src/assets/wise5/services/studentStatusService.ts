import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NodeProgress } from '../common/NodeProgress';
import { StudentStatus } from '../common/StudentStatus';
import { ConfigService } from './configService';
import { NodeProgressService } from './nodeProgressService';
import { NodeStatusService } from './nodeStatusService';
import { StudentDataService } from './studentDataService';

@Injectable()
export class StudentStatusService {
  private studentStatus: StudentStatus = new StudentStatus();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private nodeProgressService: NodeProgressService,
    private nodeStatusService: NodeStatusService,
    private studentDataService: StudentDataService
  ) {
    studentDataService.nodeStatusesChanged$.subscribe(() => {
      this.saveStudentStatus();
    });
  }

  retrieveStudentStatus(): any {
    return this.http
      .get(`/api/studentStatus/${this.configService.getWorkgroupId()}`)
      .subscribe((studentStatus: any) => {
        this.studentStatus =
          studentStatus == null
            ? new StudentStatus()
            : new StudentStatus(JSON.parse(studentStatus.status));
      });
  }

  getStudentStatus(): StudentStatus {
    return this.studentStatus;
  }

  setComputerAvatarId(computerAvatarId: string): void {
    this.studentStatus.computerAvatarId = computerAvatarId;
  }

  getComputerAvatarId(): string {
    return this.studentStatus.computerAvatarId;
  }

  private saveStudentStatus() {
    if (!this.configService.isPreview() && this.configService.isRunActive()) {
      const runId = this.configService.getRunId();
      const periodId = this.configService.getPeriodId();
      const workgroupId = this.configService.getWorkgroupId();
      const studentStatusJSON: StudentStatus = {
        runId: runId,
        periodId: periodId,
        workgroupId: workgroupId,
        currentNodeId: this.studentDataService.getCurrentNodeId(),
        nodeStatuses: this.nodeStatusService.getNodeStatuses(),
        projectCompletion: this.getProjectCompletion()
      };
      const computerAvatarId = this.getComputerAvatarId();
      if (computerAvatarId != null) {
        studentStatusJSON.computerAvatarId = computerAvatarId;
      }
      this.studentStatus = studentStatusJSON;
      const studentStatusParams = {
        runId: runId,
        periodId: periodId,
        workgroupId: workgroupId,
        status: JSON.stringify(studentStatusJSON)
      };
      return this.http
        .post(this.configService.getStudentStatusURL(), studentStatusParams)
        .toPromise()
        .then(
          (result) => {
            return true;
          },
          (result) => {
            return false;
          }
        );
    }
  }

  private getProjectCompletion(): NodeProgress {
    return this.nodeProgressService.getNodeProgress(
      'group0',
      this.nodeStatusService.getNodeStatuses()
    );
  }
}
