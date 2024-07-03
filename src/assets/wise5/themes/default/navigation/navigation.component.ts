import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentDataService } from '../../../services/studentDataService';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavItemComponent } from '../../../vle/nav-item/nav-item.component';

@Component({
  imports: [CommonModule, FlexLayoutModule, NavItemComponent],
  selector: 'navigation',
  standalone: true,
  styleUrl: './navigation.component.scss',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent {
  protected navItemIsExpanded: { [nodeId: string]: boolean } = {};
  private navItemIsExpandedSubscription: Subscription;
  @Input() rootNode: any;

  constructor(private dataService: StudentDataService) {}

  ngAfterViewInit(): void {
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
