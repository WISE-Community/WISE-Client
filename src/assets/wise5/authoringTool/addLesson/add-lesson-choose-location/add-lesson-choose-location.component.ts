import { Component, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'add-lesson-choose-location',
  templateUrl: './add-lesson-choose-location.component.html',
  styleUrls: ['./add-lesson-choose-location.component.scss']
})
export class AddLessonChooseLocationComponent implements OnInit {
  title: string;
  groupIds: string[];
  unusedGroupIds: string[] = [];

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.title = history.state.title;
    const nodeIds = Object.keys(this.projectService.idToOrder);
    nodeIds.shift(); // remove the 'group0' master root node from consideration
    this.groupIds = nodeIds.filter((nodeId) => this.isGroupNode(nodeId));
    this.unusedGroupIds = this.projectService.getInactiveGroupNodes().map((node) => node.id);
  }

  protected addLessonAfter(nodeId: string): void {
    const newLesson = this.projectService.createGroup(this.title);
    this.projectService.createNodeAfter(newLesson, nodeId);
    this.save();
  }

  protected addLessonAtBeginning(active: boolean): void {
    const newLesson = this.projectService.createGroup(this.title);
    const insertInsideNodeId = active ? 'group0' : 'inactiveGroups';
    this.projectService.createNodeInside(newLesson, insertInsideNodeId);
    this.save();
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
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  private isGroupNode(nodeId: string) {
    return this.projectService.isGroupNode(nodeId);
  }

  private save(): void {
    this.projectService.checkPotentialStartNodeIdChangeThenSaveProject().then(() => {
      setTimeout(() => {
        this.projectService.refreshProject();
        this.goToProjectView();
      }, 500);
    });
  }
}
