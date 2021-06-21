import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'discourse-latest-news',
  templateUrl: 'discourse-latest-news.component.html',
  styleUrls: ['discourse-latest-news.component.scss']
})
export class DiscourseLatestNewsComponent {
  @Input()
  discourseURL: string;

  @Input()
  category: string;

  topics: any;
  isLoaded: boolean = false;
  smallScreen: boolean = false;
  xsScreen: boolean = false;

  constructor(private http: HttpClient, private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe((result) => {
      this.smallScreen = result.matches;
    });

    this.breakpointObserver.observe([Breakpoints.XSmall]).subscribe((result) => {
      this.xsScreen = result.matches;
    });

    this.http
      .get(`${this.discourseURL}/${this.category}.json?order=latest`)
      .subscribe(({ topic_list, users }: any) => {
        this.topics = topic_list.topics
          .filter((topic) => {
            return !topic.pinned_globally;
          })
          .slice(0, 3);
        this.isLoaded = true;
      });
  }
}
