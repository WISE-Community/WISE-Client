import { Component } from '@angular/core';
import { DiscourseFeedComponent } from '../../discourse-feed/discourse-feed.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule],
  selector: 'discourse-recent-activity',
  styleUrl: 'discourse-recent-activity.component.scss',
  templateUrl: 'discourse-recent-activity.component.html'
})
export class DiscourseRecentActivityComponent extends DiscourseFeedComponent {}
