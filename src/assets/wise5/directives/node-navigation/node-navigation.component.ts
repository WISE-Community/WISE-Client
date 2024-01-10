import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeService } from '../../services/nodeService';
import { StudentDataService } from '../../services/studentDataService';

@Component({
  selector: 'node-navigation',
  templateUrl: './node-navigation.component.html'
})
export class NodeNavigationComponent implements OnInit {
  hasNextNode: boolean;
  hasPrevNode: boolean;
  private subscriptions: Subscription = new Subscription();

  constructor(private nodeService: NodeService, private studentDataService: StudentDataService) {}

  ngOnInit(): void {
    this.checkPreviousAndNextNodes();
    this.subscriptions.add(
      this.studentDataService.currentNodeChanged$.subscribe(() => {
        this.checkPreviousAndNextNodes();
      })
    );
    this.subscriptions.add(
      this.studentDataService.nodeStatusesChanged$.subscribe(() => {
        this.checkPreviousAndNextNodes();
      })
    );
  }

  private checkPreviousAndNextNodes(): void {
    this.hasPrevNode = this.nodeService.getPrevNodeId() != null;
    this.hasNextNode = false;
    this.nodeService.getNextNodeId().then((nodeId: string) => {
      this.hasNextNode = nodeId != null;
    });
  }

  goToPrevNode(): void {
    this.nodeService.goToPrevNode();
  }

  goToNextNode(): void {
    this.nodeService.goToNextNode();
  }
}
