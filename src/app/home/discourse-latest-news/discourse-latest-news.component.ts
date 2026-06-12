import { Component } from '@angular/core';
import { DiscourseFeedComponent } from '../../discourse-feed/discourse-feed.component';
import { LatestNewsComponent } from '../latest-news/latest-news.component';

@Component({
  imports: [LatestNewsComponent],
  selector: 'discourse-latest-news',
  styleUrl: 'discourse-latest-news.component.scss',
  templateUrl: 'discourse-latest-news.component.html'
})
export class DiscourseLatestNewsComponent extends DiscourseFeedComponent {}
