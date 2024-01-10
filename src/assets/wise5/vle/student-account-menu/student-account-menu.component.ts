import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { getAvatarColorForWorkgroupId } from '../../common/workgroup/workgroup';

@Component({
  selector: 'student-account-menu',
  templateUrl: './student-account-menu.component.html',
  styleUrls: ['./student-account-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StudentAccountMenuComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenu, { static: true })
  menu: MatMenu;

  hideTotalScores: boolean;
  isAuthenticated: boolean;
  maxScore: number;
  nodeStatuses: any;
  rootNode: any;
  rootNodeStatus: any;
  scorePercentage: number;
  showScore: boolean;
  subscriptions: Subscription = new Subscription();
  themeSettings: any;
  totalScoreNum: number;
  totalScore: string;
  usernamesDisplay: string;
  usersInWorkgroup: any[];
  workgroupId: number;

  constructor(
    private configService: ConfigService,
    private projectService: ProjectService,
    private sessionService: SessionService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.sessionService.isAuthenticated();
    this.nodeStatuses = this.studentDataService.nodeStatuses;
    this.rootNode = this.projectService.getProjectRootNode();
    this.rootNodeStatus = this.nodeStatuses[this.rootNode.id];
    this.workgroupId = this.configService.getWorkgroupId();
    this.usersInWorkgroup = this.configService.getUsernamesByWorkgroupId(this.workgroupId);
    this.usernamesDisplay = this.getUsernamesDisplay(this.usersInWorkgroup);
    this.maxScore = this.getMaxScore();
    this.showScore = this.maxScore != null;
    if (this.showScore) {
      this.updateScores();
      this.subscriptions.add(
        this.studentDataService.nodeStatusesChanged$.subscribe(() => {
          this.updateScores();
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private updateScores(): void {
    this.totalScoreNum = this.studentDataService.getTotalScore();
    this.totalScore = typeof this.totalScoreNum === 'number' ? this.totalScoreNum.toString() : '-';
    this.maxScore = this.getMaxScore();
    this.scorePercentage = Math.ceil((100 * this.totalScoreNum) / this.maxScore);
  }

  /**
   * Get the max possible score for the project
   * @returns the sum of the max scores for all the nodes in the project visible
   * to the current workgroup or null if none of the visible components has max scores.
   */
  private getMaxScore(): number {
    let maxScore = null;
    for (const property in this.nodeStatuses) {
      if (this.nodeStatuses.hasOwnProperty(property)) {
        const nodeStatus = this.nodeStatuses[property];
        const nodeId = nodeStatus.nodeId;
        if (nodeStatus.isVisible && !this.projectService.isGroupNode(nodeId)) {
          const nodeMaxScore = this.projectService.getMaxScoreForNode(nodeId);
          if (nodeMaxScore) {
            if (maxScore == null) {
              maxScore = 0;
            }
            maxScore += nodeMaxScore;
          }
        }
      }
    }
    return maxScore;
  }

  getUsernamesDisplay(users: any[]): string {
    let usernamesDisplay = '';
    for (const user of users) {
      if (usernamesDisplay !== '') {
        usernamesDisplay += ', ';
      }
      usernamesDisplay += user.name;
    }
    return usernamesDisplay;
  }

  getAvatarColorForWorkgroupId(workgroupId: number): string {
    return getAvatarColorForWorkgroupId(workgroupId);
  }

  goHome() {
    const nodeId = null;
    const componentId = null;
    const componentType = null;
    const category = 'Navigation';
    const event = 'goHomeButtonClicked';
    const eventData = {};
    this.studentDataService.saveVLEEvent(
      nodeId,
      componentId,
      componentType,
      category,
      event,
      eventData
    );
    this.sessionService.goHome();
  }

  logOut(eventName = 'logOut') {
    const nodeId = null;
    const componentId = null;
    const componentType = null;
    const category = 'Navigation';
    const event = eventName;
    const eventData = {};
    this.studentDataService
      .saveVLEEvent(nodeId, componentId, componentType, category, event, eventData)
      .then(() => {
        this.sessionService.logOut();
      });
  }
}
