import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InitializeVLEService } from '../../services/initializeVLEService';
import { StudentDataService } from '../../services/studentDataService';
import { VLEProjectService } from '../vleProjectService';

@Component({
  selector: 'vle-parent',
  templateUrl: './vle-parent.component.html'
})
export class VLEParentComponent implements OnInit {
  constructor(
    private initializeVLEService: InitializeVLEService,
    private projectService: VLEProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.initializeVLEService.initialized$.subscribe((initialized: boolean) => {
      if (initialized) {
        const startingNodeId = this.getStartingNodeId();
        this.studentDataService.setCurrentNodeByNodeId(startingNodeId);
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
    let nodeId =
      urlMatch != null
        ? urlMatch[1]
        : this.studentDataService.getLatestNodeEnteredEventNodeIdWithExistingNode();
    if (nodeId == null) {
      nodeId = this.projectService.getStartNodeId();
    }
    return nodeId;
  }
}
