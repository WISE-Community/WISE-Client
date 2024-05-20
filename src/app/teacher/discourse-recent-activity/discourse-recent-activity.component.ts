import { Component } from '@angular/core';
import { DiscourseFeedComponent } from '../../discourse-feed/discourse-feed.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  imports: [CommonModule, FlexLayoutModule, MatIconModule],
  selector: 'discourse-recent-activity',
  standalone: true,
  styleUrl: 'discourse-recent-activity.component.scss',
  templateUrl: 'discourse-recent-activity.component.html'
})
export class DiscourseRecentActivityComponent extends DiscourseFeedComponent {}
