import { Component } from '@angular/core';
import { DiscourseFeedComponent } from '../../discourse-feed/discourse-feed.component';

@Component({
  selector: 'discourse-recent-activity',
  templateUrl: 'discourse-recent-activity.component.html',
  styleUrls: ['discourse-recent-activity.component.scss']
})
export class DiscourseRecentActivityComponent extends DiscourseFeedComponent {
}
