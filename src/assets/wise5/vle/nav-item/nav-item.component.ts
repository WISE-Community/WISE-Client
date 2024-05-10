import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { NodeService } from '../../services/nodeService';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NodeIconComponent } from '../node-icon/node-icon.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NodeStatusIconComponent } from '../../themes/default/themeComponents/nodeStatusIcon/node-status-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatTooltipModule,
    NodeIconComponent,
    NodeStatusIconComponent
  ],
  selector: 'nav-item',
  standalone: true,
  styleUrl: 'nav-item.component.scss',
  templateUrl: 'nav-item.component.html'
})
export class NavItemComponent {
  private currentNode: any;
  protected expanded: boolean;
  private isCurrentNode: boolean;
  protected isGroup: boolean;
  protected isPrevStep: boolean;
  protected item: any;
  @Input() nodeId: string;
  protected nodeStatus: any;
  protected nodeTitle: string;
  @Input() showPosition: any;
  private subscriptions: Subscription = new Subscription();
  @Input() type: string;

  constructor(
    private dataService: StudentDataService,
    private nodeService: NodeService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.item = this.projectService.idToNode[this.nodeId];
    this.isGroup = this.projectService.isGroupNode(this.nodeId);
    this.nodeStatus = this.dataService.nodeStatuses[this.nodeId];
    this.nodeTitle = this.showPosition
      ? this.projectService.nodeIdToNumber[this.nodeId] + ': ' + this.item.title
      : this.item.title;
    this.currentNode = this.dataService.currentNode;
    this.isCurrentNode = this.currentNode.id === this.nodeId;
    if (this.isGroup && this.isCurrentNode) {
      this.setExpanded();
    }
    this.subscriptions.add(
      this.dataService.navItemIsExpanded$.subscribe(({ nodeId, isExpanded }) => {
        if (nodeId === this.nodeId) {
          this.expanded = isExpanded;
        }
      })
    );
    this.subscriptions.add(
      this.dataService.currentNodeChanged$.subscribe(
        ({ previousNode: oldNode, currentNode: newNode }) => {
          this.currentNode = newNode;
          this.isCurrentNode = this.nodeId === newNode.id;
          let isPrev = false;
          if (this.projectService.isApplicationNode(newNode.id)) {
            return;
          }
          if (oldNode) {
            isPrev = this.nodeId === oldNode.id;
            if (this.dataService.previousStep) {
              this.isPrevStep = this.nodeId === this.dataService.previousStep.id;
            }
          }
          if (this.isGroup) {
            let prevNodeisGroup = !oldNode || this.projectService.isGroupNode(oldNode.id);
            let prevNodeIsDescendant = this.projectService.isNodeDescendentOfGroup(
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
            if (isPrev && this.projectService.isNodeDescendentOfGroup(this.item, newNode)) {
              this.zoomToElement();
            }
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private setExpanded(): void {
    this.expanded = true;
    this.dataService.setNavItemExpanded(this.nodeId, this.expanded);
  }

  private zoomToElement(): void {
    // TODO: implement me
  }

  protected itemClicked(): void {
    if (this.isGroup) {
      this.expanded = !this.expanded;
      if (this.expanded) {
        if (this.isCurrentNode) {
          this.zoomToElement();
        } else {
          this.nodeService.setCurrentNode(this.nodeId);
        }
      }
      this.dataService.setNavItemExpanded(this.nodeId, this.expanded);
    } else {
      this.nodeService.setCurrentNode(this.nodeId);
    }
  }
}
