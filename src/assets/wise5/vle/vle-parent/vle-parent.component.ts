import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InitializeVLEService } from '../../services/initializeVLEService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../vleProjectService';

@Component({
  imports: [RouterModule],
  template: `<router-outlet />`
})
export class VLEParentComponent implements OnInit {
  constructor(
    private dataService: StudentDataService,
    private initializeVLEService: InitializeVLEService,
    private projectService: VLEProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeVLEService.initialized$.subscribe((initialized: boolean) => {
      if (initialized) {
        const startingNodeId = this.getStartingNodeId();
        this.dataService.setCurrentNodeByNodeId(startingNodeId);
        this.router.navigate([startingNodeId], { relativeTo: this.route.parent });
      }
    });
    const unitId = this.router.url.match(/unit\/([0-9]*)/)[1];
    if (this.router.url.includes('/preview/unit')) {
      this.initializeVLEService.initializePreview(unitId);
    } else {
      this.initializeVLEService.initializeStudent(unitId);
    }
  }

  private getStartingNodeId(): string {
    const urlMatch = this.router.url.match(/unit\/[0-9]*\/([^?]*)/);
    return urlMatch != null
      ? urlMatch[1]
      : (this.getLastNodeEnteredEvent()?.nodeId ?? this.projectService.getStartNodeId());
  }

  /**
   * Get the last node entered event for an active node that exists in the project.
   * We need to check if the node exists in the project in case the node has been deleted
   * from the project. We also need to check that the node is active in case the node has been
   * moved to the inactive section of the project.
   * @return the last node entered event for an active node that exists in the project
   */
  private getLastNodeEnteredEvent(): any {
    return this.dataService
      .getEvents()
      .findLast(
        (event) => event.event === 'nodeEntered' && this.isNodeExistAndActive(event.nodeId)
      );
  }

  private isNodeExistAndActive(nodeId: string): boolean {
    return this.projectService.getNodeById(nodeId) != null && this.projectService.isActive(nodeId);
  }
}
