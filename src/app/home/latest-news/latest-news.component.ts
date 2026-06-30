import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { News } from '../../domain/news';
import { RouterLink } from '@angular/router';

type Topic = News | { slug: string; id: number; title: string };

@Component({
  imports: [CommonModule, MatIconModule, RouterLink],
  selector: 'latest-news',
  styleUrl: './latest-news.component.scss',
  templateUrl: './latest-news.component.html'
})
export class LatestNewsComponent {
  @Input() baseUrl?: string;
  @Input() category?: string;
  @Input() isDiscourseNewsAvailable: boolean;
  @Input() loaded: boolean;
  protected smallScreen: boolean;
  protected threeTopics: Topic[];
  @Input() topics: Topic[];
  protected xsScreen: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    protected dialog: MatDialog,
    protected http: HttpClient
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

  ngOnChanges(): void {
    this.threeTopics = this.topics?.slice(0, 3) ?? [];
  }
}
