import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodeService } from '../../services/nodeService';
import { StudentDataService } from '../../services/studentDataService';
import { MatButtonModule } from '@angular/material/button';
import { Directionality } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule],
  selector: 'node-navigation',
  templateUrl: './node-navigation.component.html'
})
export class NodeNavigationComponent implements OnInit {
  protected hasNextNode: boolean;
  protected hasPrevNode: boolean;
  protected nextIcon: string;
  protected prevIcon: string;
  @Input() showPrevNodeNav: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private dataService: StudentDataService,
    protected dir: Directionality,
    private nodeService: NodeService
  ) {}

  ngOnInit(): void {
    this.checkPreviousAndNextNodes();
    const isRtl = this.dir.value === 'rtl';
    this.nextIcon = isRtl ? 'chevron_left' : 'chevron_right';
    this.prevIcon = isRtl ? 'chevron_right' : 'chevron_left';
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
