import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NodeInfoService } from '../../../../services/nodeInfoService';
import { TeacherDataService } from '../../../../services/teacherDataService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConfigService } from '../../../../services/configService';

@Component({
  selector: 'milestone-details',
  styleUrls: ['./milestone-details.component.scss'],
  templateUrl: './milestone-details.component.html'
})
export class MilestoneDetailsComponent implements OnInit {
  description: SafeHtml;
  @Input() milestone;
  @Output() onVisitNodeGrading = new EventEmitter<string>();
  recommendations: SafeHtml;
  report: SafeHtml;
  requiredNodeIds: string[];

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private nodeInfoService: NodeInfoService,
    private projectService: TeacherProjectService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.milestone.description) {
      this.description = this.sanitizer.bypassSecurityTrustHtml(this.milestone.description);
    }
    if (this.milestone.generatedRecommendations) {
      this.recommendations = this.sanitizer.bypassSecurityTrustHtml(
        this.milestone.generatedRecommendations
      );
    }
    if (this.milestone.generatedReport) {
      this.report = this.sanitizer.bypassSecurityTrustHtml(this.milestone.generatedReport);
    }
    this.requiredNodeIds = this.getRequirements();
  }

  getAvatarColorForWorkgroupId(workgroupId: number): string {
    return this.configService.getAvatarColorForWorkgroupId(workgroupId);
  }

  getDisplayNamesByWorkgroupId(workgroupId: number): string {
    return this.configService.getDisplayNamesByWorkgroupId(workgroupId);
  }

  getRequirements(): string[] {
    const requirements = [];
    Object.entries(this.milestone.items).forEach(([key, value]) => {
      if ((value as any).checked) {
        requirements.push(key);
      }
    });
    return requirements;
  }

  getNodeNumberAndTitleByNodeId(nodeId: string): string {
    return `${this.getNodeNumberByNodeId(nodeId)}: ${this.getNodeTitle(nodeId)}`;
  }

  getNodeNumberByNodeId(nodeId: string): string {
    return this.projectService.nodeIdToNumber[nodeId];
  }

  getNodeTitle(nodeId: string): string {
    return this.projectService.getNodeTitle(nodeId);
  }

  saveTabSelectedEvent(event: MatTabChangeEvent): void {
    const name = `Milestone${event.tab.textLabel.replace(' ', '')}TabSelected`;
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      data = { milestoneId: this.milestone.id };
    this.dataService.saveEvent(context, nodeId, componentId, componentType, category, name, data);
  }

  showMilestoneStepInfo($event: Event): void {
    this.nodeInfoService.showNodeInfo(this.milestone.nodeId, $event);
  }

  sortAchievementTimeDescending(workgroup: any[]): any[] {
    return workgroup.sort((a, b) => {
      return b.achievementTime - a.achievementTime;
    });
  }

  visitNodeGrading(nodeId: string): void {
    this.onVisitNodeGrading.emit(nodeId);
  }
}
