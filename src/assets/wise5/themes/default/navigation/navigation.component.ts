import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentDataService } from '../../../services/studentDataService';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  navItemIsExpanded: any = {};
  navItemIsExpandedSubscription: Subscription;
  @Input() rootNode: any;

  constructor(private studentDataService: StudentDataService) {}

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
