import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentDataService } from '../../../services/studentDataService';
import { VLEProjectService } from '../../../vle/vleProjectService';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navItemIsExpanded: any = {};
  navItemIsExpandedSubscription: Subscription;
  rootNode: any;

  constructor(
    private projectService: VLEProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    this.rootNode = this.projectService.getProjectRootNode();
  }

  ngAfterViewInit(): void {
    this.navItemIsExpandedSubscription = this.studentDataService.navItemIsExpanded$.subscribe(
      ({ nodeId, isExpanded }) => {
        this.navItemIsExpanded[nodeId] = isExpanded;
      }
    );
  }

  ngOnDestroy(): void {
    this.navItemIsExpandedSubscription.unsubscribe();
  }
}
