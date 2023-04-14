'use strict';

import { AchievementService } from './achievementService';
import { ConfigService } from './configService';
import { ProjectService } from './projectService';
import { TeacherDataService } from './teacherDataService';
import { Injectable } from '@angular/core';
import { copy } from '../common/object/object';
import { MilestoneReportService } from './milestoneReportService';

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

  getProjectMilestones() {
    const achievements = this.projectService.getAchievements();
    if (achievements.isEnabled) {
      return achievements.items.filter((achievement) => {
        return ['milestone', 'milestoneReport'].includes(achievement.type);
      });
    }
    return [];
  }

  getMilestoneReportByNodeId(nodeId: string): any {
    for (const milestonReport of this.getProjectMilestoneReports()) {
      const referencedComponent = this.getReferencedComponent(milestonReport);
      if (referencedComponent.nodeId === nodeId) {
        return this.getProjectMilestoneStatus(milestonReport.id);
      }
    }
    return null;
  }

  private getProjectMilestoneReports(): any[] {
    return this.getProjectMilestones().filter((milestone) => {
      return milestone.type === 'milestoneReport';
    });
  }

  getProjectMilestoneStatus(milestoneId: string) {
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

  insertMilestoneItems(milestone: any) {
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

  insertMilestoneCompletion(milestone: any) {
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

  setWorkgroupsInCurrentPeriod() {
    this.workgroupIds = [];
    for (const workgroupId of this.configService.getClassmateWorkgroupIds()) {
      const currentPeriodId = this.configService.getPeriodIdByWorkgroupId(workgroupId);
      if (this.periodId === -1 || currentPeriodId === this.periodId) {
        this.workgroupIds.push(workgroupId);
      }
    }
    this.numberOfStudentsInRun = this.workgroupIds.length;
  }

  insertMilestoneReport(milestone: any) {
    const referencedComponent = this.getReferencedComponent(milestone);
    milestone.nodeId = referencedComponent.nodeId;
    milestone.componentId = referencedComponent.componentId;
    if (this.isCompletionReached(milestone)) {
      const report = this.milestoneReportService.generate(milestone, this.periodId);
      this.setReportAvailable(milestone, true);
      milestone.generatedReport = report.content ? report.content : null;
      milestone.generatedRecommendations = report.recommendations ? report.recommendations : null;
    } else {
      this.setReportAvailable(milestone, false);
    }
    return milestone;
  }

  getReferencedComponent(milestone: any) {
    const referencedComponents = this.getSatisfyCriteriaReferencedComponents(milestone);
    const referencedComponentValues: any[] = Object.values(referencedComponents);
    return referencedComponentValues[referencedComponentValues.length - 1];
  }

  isCompletionReached(projectAchievement: any) {
    return (
      projectAchievement.percentageCompleted >= projectAchievement.satisfyMinPercentage &&
      projectAchievement.numberOfStudentsCompleted >= projectAchievement.satisfyMinNumWorkgroups
    );
  }

  getSatisfyCriteriaReferencedComponents(projectAchievement: any) {
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

  setReportAvailable(projectAchievement: any, reportAvailable: boolean) {
    projectAchievement.isReportAvailable = reportAvailable;
  }
}
