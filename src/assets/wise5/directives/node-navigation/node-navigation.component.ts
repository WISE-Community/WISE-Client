import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeService } from '../../services/nodeService';
import { StudentDataService } from '../../services/studentDataService';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, FlexLayoutModule, MatButtonModule],
  selector: 'node-navigation',
  standalone: true,
  templateUrl: './node-navigation.component.html'
})
export class NodeNavigationComponent implements OnInit {
  protected hasNextNode: boolean;
  protected hasPrevNode: boolean;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private dataService: StudentDataService,
    private nodeService: NodeService
  ) {}

  ngOnInit(): void {
    this.checkPreviousAndNextNodes();
    this.subscriptions.add(
      this.dataService.currentNodeChanged$.subscribe(() => {
        this.checkPreviousAndNextNodes();
      })
    );
    this.subscriptions.add(
      this.dataService.nodeStatusesChanged$.subscribe(() => {
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

  protected goToPrevNode(): void {
    this.nodeService.goToPrevNode();
  }

  protected goToNextNode(): void {
    this.nodeService.goToNextNode();
  }
}
