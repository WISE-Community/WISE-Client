import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../../vle/vleProjectService';

class GroupNode {
  id: string;
  startId: string;
  title: string;
}

@Component({
  selector: 'group-tabs',
  templateUrl: './group-tabs.component.html'
})
export class GroupTabsComponent implements OnInit {
  groupNodes: GroupNode[] = [];
  selectedTabIndex: number;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private projectService: VLEProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.groupNodes = this.projectService.rootNode.ids.map((id: string) =>
      this.projectService.getNodeById(id)
    );
    this.selectCurrentGroupTab();
    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(() => {
        this.selectCurrentGroupTab();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private selectCurrentGroupTab(): void {
    const currentNode = this.studentDataService.getCurrentNode();
    this.selectedTabIndex = this.groupNodes.indexOf(
      this.projectService.getParentGroup(currentNode.id)
    );
  }

  goToGroupTab(groupTabIndex: number): void {
    const groupStartNodeId = this.groupNodes[groupTabIndex].startId;
    this.studentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(groupStartNodeId);
  }
}
