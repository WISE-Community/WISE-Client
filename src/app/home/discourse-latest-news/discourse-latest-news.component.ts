import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DiscourseFeedComponent } from '../../discourse-feed/discourse-feed.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, FlexLayoutModule, MatIconModule],
  selector: 'discourse-latest-news',
  standalone: true,
  styleUrl: 'discourse-latest-news.component.scss',
  templateUrl: 'discourse-latest-news.component.html'
})
export class DiscourseLatestNewsComponent extends DiscourseFeedComponent {
  protected smallScreen: boolean;
  protected xsScreen: boolean;

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
