import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { News } from '../../domain/news';

@Component({
  selector: 'latest-news',
  imports: [CommonModule, MatIconModule],
  templateUrl: './latest-news.component.html',
  styleUrl: './latest-news.component.scss'
})
export class LatestNewsComponent {
  protected smallScreen: boolean;
  protected xsScreen: boolean;
  @Input() isDiscourseNewsAvailable: boolean;
  @Input() topics: News[] | { slug: string; id: number; title: string }[];
  @Input() baseUrl?: string;
  @Input() category?: string;
  @Input() isLoaded: boolean;

  constructor(
    protected http: HttpClient,
    private breakpointObserver: BreakpointObserver
  ) {
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
