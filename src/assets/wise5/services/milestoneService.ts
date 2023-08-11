'use strict';

import { AchievementService } from './achievementService';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { TeacherDataService } from './teacherDataService';
import { Injectable } from '@angular/core';
import { copy } from '../common/object/object';
import { MilestoneReportService } from './milestoneReportService';
import { Milestone } from '../../../app/domain/milestone';

@Injectable()
export class MilestoneService {
  numberOfStudentsInRun: number;
  periodId: any;
  projectMilestones: any[];
  workgroupIds: any[];

  constructor(
    private achievementService: AchievementService,
    private configService: ConfigService,
    private milestoneReportService: MilestoneReportService,
    private projectService: ProjectService,
    private teacherDataService: TeacherDataService
  ) {}

  getProjectMilestones(): Milestone[] {
    const achievements = this.projectService.getAchievements();
    if (achievements.isEnabled) {
      return achievements.items.filter((achievement) => {
        return ['milestone', 'milestoneReport'].includes(achievement.type);
      });
    }
    return [];
  }

  getMilestoneReportByNodeId(nodeId: string): any {
    for (const milestoneReport of this.getProjectMilestoneReports()) {
      const referencedComponent = this.getReferencedComponent(milestoneReport);
      if (referencedComponent.nodeId === nodeId) {
        return this.getProjectMilestoneStatus(milestoneReport.id);
      }
    }
    return null;
  }

  private getProjectMilestoneReports(): Milestone[] {
    return this.getProjectMilestones().filter((milestone) => milestone.type === 'milestoneReport');
  }

  getProjectMilestoneStatus(milestoneId: string): any {
    this.periodId = this.teacherDataService.getCurrentPeriod().periodId;
    this.setWorkgroupsInCurrentPeriod();
    let milestone = this.projectService.getAchievementByAchievementId(milestoneId);
    milestone = this.insertMilestoneItems(milestone);
    milestone = this.insertMilestoneCompletion(milestone);
    if (milestone.type === 'milestoneReport') {
      milestone = this.insertMilestoneReport(milestone);
    }
    return milestone;
  }

  insertMilestoneItems(milestone: any): any {
    milestone.items = copy(this.projectService.idToOrder);
    if (milestone.params != null && milestone.params.nodeIds != null) {
      for (const nodeId of milestone.params.nodeIds) {
        if (milestone.items[nodeId] != null) {
          milestone.items[nodeId].checked = true;
        }
      }
    }
    return milestone;
  }

  insertMilestoneCompletion(milestone: any): any {
    const achievementIdToStudentAchievements = this.achievementService.getAchievementIdToStudentAchievementsMappings();
    const studentAchievements = achievementIdToStudentAchievements[milestone.id];
    const workgroupIdsCompleted = [];
    const achievementTimes = [];
    const workgroupIdsNotCompleted = [];

    for (const studentAchievement of studentAchievements) {
      const currentWorkgroupId = studentAchievement.workgroupId;
      if (this.workgroupIds.indexOf(currentWorkgroupId) > -1) {
        workgroupIdsCompleted.push(currentWorkgroupId);
        achievementTimes.push(studentAchievement.achievementTime);
      }
    }

    for (const workgroupId of this.workgroupIds) {
      if (workgroupIdsCompleted.indexOf(workgroupId) === -1) {
        workgroupIdsNotCompleted.push(workgroupId);
      }
    }

    milestone.workgroups = [];

    for (let c = 0; c < workgroupIdsCompleted.length; c++) {
      const workgroupId = workgroupIdsCompleted[c];
      const achievementTime = achievementTimes[c];
      const workgroupObject = {
        workgroupId: workgroupId,
        displayNames: this.configService.getDisplayUsernamesByWorkgroupId(workgroupId),
        achievementTime: achievementTime,
        completed: true
      };
      milestone.workgroups.push(workgroupObject);
    }

    for (const workgroupId of workgroupIdsNotCompleted) {
      const workgroupObject = {
        workgroupId: workgroupId,
        displayNames: this.configService.getDisplayUsernamesByWorkgroupId(workgroupId),
        achievementTime: null,
        completed: false
      };
      milestone.workgroups.push(workgroupObject);
    }

    milestone.numberOfStudentsCompleted = workgroupIdsCompleted.length;
    milestone.numberOfStudentsInRun = this.numberOfStudentsInRun;
    milestone.percentageCompleted = Math.round(
      (100 * milestone.numberOfStudentsCompleted) / this.numberOfStudentsInRun
    );
    return milestone;
  }

  setWorkgroupsInCurrentPeriod(): void {
    this.workgroupIds = [];
    for (const workgroupId of this.configService.getClassmateWorkgroupIds()) {
      const currentPeriodId = this.configService.getPeriodIdByWorkgroupId(workgroupId);
      if (this.periodId === -1 || currentPeriodId === this.periodId) {
        this.workgroupIds.push(workgroupId);
      }
    }
    this.numberOfStudentsInRun = this.workgroupIds.length;
  }

  insertMilestoneReport(milestone: Milestone): Milestone {
    const referencedComponent = this.getReferencedComponent(milestone);
    milestone.nodeId = referencedComponent.nodeId;
    milestone.componentId = referencedComponent.componentId;
    if (this.isCompletionReached(milestone)) {
      const report = this.milestoneReportService.generate(milestone, this.periodId);
      milestone.isReportAvailable = true;
      milestone.generatedReport = report.content ? report.content : null;
      milestone.generatedRecommendations = report.recommendations ? report.recommendations : null;
    } else {
      milestone.isReportAvailable = false;
    }
    return milestone;
  }

  getReferencedComponent(milestone: any): any {
    const referencedComponents = this.getSatisfyCriteriaReferencedComponents(milestone);
    const referencedComponentValues: any[] = Object.values(referencedComponents);
    return referencedComponentValues[referencedComponentValues.length - 1];
  }

  isCompletionReached(projectAchievement: any): boolean {
    return (
      projectAchievement.percentageCompleted >= projectAchievement.satisfyMinPercentage &&
      projectAchievement.numberOfStudentsCompleted >= projectAchievement.satisfyMinNumWorkgroups
    );
  }

  getSatisfyCriteriaReferencedComponents(projectAchievement: any): any {
    const components = {};
    const templates = projectAchievement.report.templates;
    for (const template of templates) {
      for (const satisfyCriterion of template.satisfyCriteria) {
        const nodeId = satisfyCriterion.nodeId;
        const componentId = satisfyCriterion.componentId;
        const component = {
          nodeId: nodeId,
          componentId: componentId
        };
        components[nodeId + '_' + componentId] = component;
      }
    }
    return components;
  }
}
