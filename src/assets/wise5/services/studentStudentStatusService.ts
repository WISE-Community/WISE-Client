import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentStatus } from '../common/StudentStatus';
import { ConfigService } from './configService';

@Injectable()
export class StudentStudentStatusService {
  studentStatus: StudentStatus;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  retrieveStudentStatus(): any {
    if (this.configService.isPreview()) {
      this.setStudentStatus(new StudentStatus());
    } else {
      return this.http
        .get(`/api/studentStatus/${this.configService.getWorkgroupId()}`)
        .subscribe((studentStatus: any) => {
          if (studentStatus == null) {
            this.setStudentStatus(new StudentStatus());
          } else {
            this.setStudentStatus(JSON.parse(studentStatus.status));
          }
        });
    }
  }

  setStudentStatus(studentStatus: StudentStatus): void {
    this.studentStatus = studentStatus;
  }

  setComputerAvatarId(computerAvatarId: string): void {
    this.studentStatus.computerAvatarId = computerAvatarId;
  }

  getComputerAvatarId(): string {
    return this.studentStatus.computerAvatarId;
  }
}
