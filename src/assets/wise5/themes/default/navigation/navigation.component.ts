import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentDataService } from '../../../services/studentDataService';
import { VLEProjectService } from '../../../vle/vleProjectService';
import { CommonModule } from '@angular/common';
import { NavItemComponent } from '../../../vle/nav-item/nav-item.component';

@Component({
  imports: [CommonModule, NavItemComponent],
  selector: 'navigation',
  styleUrl: './navigation.component.scss',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
  protected navItemIsExpanded: { [nodeId: string]: boolean } = {};
  private navItemIsExpandedSubscription: Subscription;
  protected rootNode: any;

  constructor(
    private dataService: StudentDataService,
    private projectService: VLEProjectService
  ) {}

  ngOnInit(): void {
    this.rootNode = this.projectService.getProjectRootNode();
    this.navItemIsExpandedSubscription = this.dataService.navItemIsExpanded$.subscribe(
      ({ nodeId, isExpanded }) => {
        this.navItemIsExpanded[nodeId] = isExpanded;
      }
    );
  }

  ngOnDestroy(): void {
    this.navItemIsExpandedSubscription.unsubscribe();
  }
}
