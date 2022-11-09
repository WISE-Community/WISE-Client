import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { ConfigService } from '../../services/configService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';

@Component({
  selector: 'student-account-menu',
  templateUrl: './student-account-menu.component.html',
  styleUrls: ['./student-account-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StudentAccountMenuComponent implements OnInit {
  @ViewChild(MatMenu, { static: true })
  menu: MatMenu;

  hideTotalScores: boolean;
  isAuthenticated: boolean;
  maxScore: number;
  nodeStatuses: any;
  rootNode: any;
  rootNodeStatus: any;
  scorePercentage: number;
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
    this.totalScoreNum = this.studentDataService.getTotalScore();
    this.totalScore = typeof this.totalScoreNum === 'number' ? this.totalScoreNum.toString() : '-';
    this.maxScore = this.studentDataService.maxScore;
    this.scorePercentage = Math.ceil((100 * this.totalScoreNum) / this.maxScore);
    this.usernamesDisplay = this.getUsernamesDisplay(this.usersInWorkgroup);
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
    return this.configService.getAvatarColorForWorkgroupId(workgroupId);
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
