'use strict';

import { Component, Input, OnInit } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';
import { ConfigService } from '../../../services/configService';
import { SessionService } from '../../../services/sessionService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  selector: 'at-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  avatarColor: any;
  contextPath: string;
  @Input() logoPath: string;
  @Input() projectId: number;
  projectInfo: string;
  @Input() projectTitle: string;
  @Input() runId: number;
  @Input() runCode: string;
  userInfo: any;
  workgroupId: number;

  constructor(
    private configService: ConfigService,
    private projectService: TeacherProjectService,
    private sessionService: SessionService,
    private upgrade: UpgradeModule
  ) {}

  ngOnInit(): void {
    this.workgroupId = this.configService.getWorkgroupId();
    if (this.workgroupId == null) {
      this.workgroupId = 100 * Math.random();
    }
    this.avatarColor = getAvatarColorForWorkgroupId(this.workgroupId);
    this.userInfo = this.configService.getMyUserInfo();
    this.contextPath = this.configService.getContextPath();
  }

  ngOnChanges() {
    this.projectInfo = this.getProjectInfo();
  }

  private getProjectInfo(): string {
    let projectInfo = $localize`ID: ${this.projectId}`;
    if (this.runId) {
      projectInfo += ` | ` + $localize`Run ID: ${this.runId} | Access Code: ${this.runCode}`;
    }
    return projectInfo;
  }

  protected showHelp(): void {
    window.open(
      'https://docs.google.com/document/d/1G8lVtiUlGXLRAyFOvkEdadHYhJhJLW4aor9dol2VzeU',
      '_blank'
    );
  }

  protected switchToGradingView(): void {
    const state = this.upgrade.$injector.get('$state');
    if (state.current.name === 'root.at.project.notebook') {
      state.go('root.cm.notebooks', { runId: this.runId });
    } else if (state.current.name === 'root.at.project.node') {
      state.go('root.cm.unit.node', {
        runId: this.runId,
        nodeId: state.params.nodeId
      });
    } else {
      state.go('root.cm.unit', { runId: this.runId });
    }
  }

  protected goHome(): void {
    this.projectService.notifyAuthorProjectEnd().then(() => {
      this.sessionService.goHome();
    });
  }

  protected logOut(): void {
    this.sessionService.logOut();
  }
}
