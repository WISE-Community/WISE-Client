'use strict';

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { NodeService } from '../../services/nodeService';

@Component({
  selector: 'nav-item',
  styleUrls: ['nav-item.component.scss'],
  templateUrl: 'nav-item.component.html',
  encapsulation: ViewEncapsulation.None
})
export class NavItemComponent {
  currentNode: any;
  expanded: boolean = false;
  isCurrentNode: boolean;
  isGroup: boolean;
  isPrevStep: boolean = false;
  item: any;
  subscriptions: Subscription = new Subscription();

  @Input()
  nodeId: string;
  nodeStatus: any;
  nodeTitle: string;

  @Input()
  showPosition: any;

  @Input()
  type: string;

  constructor(
    private nodeService: NodeService,
    private ProjectService: ProjectService,
    private StudentDataService: StudentDataService
  ) {}

  ngOnInit() {
    this.item = this.ProjectService.idToNode[this.nodeId];
    this.isGroup = this.ProjectService.isGroupNode(this.nodeId);
    this.nodeStatus = this.StudentDataService.nodeStatuses[this.nodeId];
    this.setNodeTitle();
    this.currentNode = this.StudentDataService.currentNode;
    this.isCurrentNode = this.currentNode.id === this.nodeId;
    if (this.isGroup && this.isCurrentNode) {
      this.setExpanded();
    }
    this.subscriptions.add(this.ProjectService.projectParsed$.subscribe(() => this.setNodeTitle()));
    this.subscriptions.add(
      this.StudentDataService.navItemIsExpanded$.subscribe(({ nodeId, isExpanded }) => {
        if (nodeId === this.nodeId) {
          this.expanded = isExpanded;
        }
      })
    );
    this.subscriptions.add(
      this.StudentDataService.currentNodeChanged$.subscribe(
        ({ previousNode: oldNode, currentNode: newNode }) => {
          this.currentNode = newNode;
          this.isCurrentNode = this.nodeId === newNode.id;
          let isPrev = false;
          if (this.ProjectService.isApplicationNode(newNode.id)) {
            return;
          }
          if (oldNode) {
            isPrev = this.nodeId === oldNode.id;
            if (this.StudentDataService.previousStep) {
              this.isPrevStep = this.nodeId === this.StudentDataService.previousStep.id;
            }
          }
          if (this.isGroup) {
            let prevNodeisGroup = !oldNode || this.ProjectService.isGroupNode(oldNode.id);
            let prevNodeIsDescendant = this.ProjectService.isNodeDescendentOfGroup(
              oldNode,
              this.item
            );
            if (this.isCurrentNode) {
              this.setExpanded();
              if (prevNodeisGroup || !prevNodeIsDescendant) {
                this.zoomToElement();
              }
            } else {
              if (!prevNodeisGroup) {
                if (prevNodeIsDescendant) {
                  this.expanded = true;
                } else {
                  this.expanded = false;
                }
              }
            }
          } else {
            if (isPrev && this.ProjectService.isNodeDescendentOfGroup(this.item, newNode)) {
              this.zoomToElement();
            }
          }
        }
      )
    );
  }

  private setNodeTitle(): void {
    this.nodeTitle = this.showPosition
      ? this.ProjectService.getNodePositionAndTitle(this.nodeId)
      : this.ProjectService.getNodeTitle(this.nodeId);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setExpanded(): void {
    this.expanded = true;
    this.StudentDataService.setNavItemExpanded(this.nodeId, this.expanded);
  }

  zoomToElement() {
    // TODO: implement me
  }

  itemClicked(event) {
    if (this.isGroup) {
      this.expanded = !this.expanded;
      if (this.expanded) {
        if (this.isCurrentNode) {
          this.zoomToElement();
        } else {
          this.nodeService.setCurrentNode(this.nodeId);
        }
      }
      this.StudentDataService.setNavItemExpanded(this.nodeId, this.expanded);
    } else {
      this.nodeService.setCurrentNode(this.nodeId);
    }
  }
}
