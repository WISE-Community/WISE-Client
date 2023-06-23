import { Component, OnInit } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

@Component({
  templateUrl: './add-lesson-choose-location.component.html',
  styleUrls: ['./add-lesson-choose-location.component.scss']
})
export class AddLessonChooseLocationComponent implements OnInit {
  title: string;
  groupIds: string[];
  unusedGroupIds: string[] = [];

  constructor(
    private dataService: TeacherDataService,
    private projectService: TeacherProjectService,
    private upgrade: UpgradeModule
  ) {
    this.title = this.upgrade.$injector.get('$stateParams').title;
  }

  ngOnInit(): void {
    const nodeIds = Object.keys(this.projectService.idToOrder);
    nodeIds.shift(); // remove the 'group0' master root node from consideration
    this.groupIds = nodeIds.filter((nodeId) => this.isGroupNode(nodeId));
    this.unusedGroupIds = this.projectService.getInactiveGroupNodes().map((node) => node.id);
  }

  protected addLessonAfter(nodeId: string): void {
    const newLesson = this.projectService.createGroup(this.title);
    this.projectService.createNodeAfter(newLesson, nodeId);
    this.save(newLesson);
  }

  protected addLessonAtBeginning(active: boolean): void {
    const newLesson = this.projectService.createGroup(this.title);
    const insertInsideNodeId = active ? 'group0' : 'inactiveGroups';
    this.projectService.createNodeInside(newLesson, insertInsideNodeId);
    this.save(newLesson);
  }

  protected cancel(): void {
    this.goToProjectView();
  }

  protected getNodePositionAndTitle(nodeId: string) {
    const title = this.projectService.getNodeTitle(nodeId);
    return this.projectService.isActive(nodeId)
      ? `${this.projectService.getNodePositionById(nodeId)} : ${title}`
      : title;
  }

  private goToProjectView(): void {
    this.upgrade.$injector.get('$state').go('root.at.project');
  }

  private isGroupNode(nodeId: string) {
    return this.projectService.isGroupNode(nodeId);
  }

  private save(newLesson: any): void {
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      this.projectService.refreshProject();
      this.saveEvent('activityCreated', {
        nodeId: newLesson.id,
        title: this.projectService.getNodePositionAndTitle(newLesson.id)
      });
      this.goToProjectView();
    });
  }

  private saveEvent(eventName: string, data = {}): void {
    const category = 'Authoring';
    const context = 'AuthoringTool';
    const nodeId = null;
    const componentId = null;
    const componentType = null;
    this.dataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      eventName,
      data
    );
  }
}
