import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DiscourseFeedComponent } from '../../discourse-feed/discourse-feed.component';

@Component({
  selector: 'discourse-latest-news',
  templateUrl: 'discourse-latest-news.component.html',
  styleUrls: ['discourse-latest-news.component.scss']
})
export class DiscourseLatestNewsComponent extends DiscourseFeedComponent {
  smallScreen: boolean = false;
  xsScreen: boolean = false;

  constructor(protected http: HttpClient, private breakpointObserver: BreakpointObserver) {
    super(http);

    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
      this.smallScreen = result.matches;
    });

    this.breakpointObserver.observe([Breakpoints.XSmall]).subscribe((result) => {
      this.xsScreen = result.matches;
    });
  }
}
