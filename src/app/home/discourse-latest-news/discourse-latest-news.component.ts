import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DiscourseFeedComponent } from '../../discourse-feed/discourse-feed.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatIconModule],
  selector: 'discourse-latest-news',
  styleUrl: 'discourse-latest-news.component.scss',
  templateUrl: 'discourse-latest-news.component.html'
})
export class DiscourseLatestNewsComponent extends DiscourseFeedComponent {
  protected smallScreen: boolean;
  protected xsScreen: boolean;

  constructor(
    protected http: HttpClient,
    private breakpointObserver: BreakpointObserver
  ) {
    super(http);
    this.breakpointObserver
      .observe(['(max-width: 40rem)', '(max-width: 48rem)'])
      .subscribe((result) => {
        this.smallScreen = result.matches;
      });
    this.breakpointObserver.observe(['(max-width: 40rem)']).subscribe((result) => {
      this.xsScreen = result.matches;
    });
  }
}
