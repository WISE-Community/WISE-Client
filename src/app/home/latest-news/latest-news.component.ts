import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { News } from '../../domain/news';
import { MatDialog } from '@angular/material/dialog';
import { MoreNewsDialogComponent } from '../more-news-dialog/more-news-dialog.component';
import { NewsItemDialogComponent } from '../news-item-dialog/news-item-dialog.component';

type Topic = News | { slug: string; id: number; title: string };

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
  @Input() topics: Topic[];
  protected threeTopics: Topic[];
  @Input() baseUrl?: string;
  @Input() category?: string;
  @Input() isLoaded: boolean;

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
    this.threeTopics = this.topics.slice(0, 3);
  }

  protected openNewsDialog(event: Event): void {
    event.preventDefault();
    this.dialog.open(MoreNewsDialogComponent, {
      panelClass: 'dialog-sm',
      data: { topics: this.topics }
    });
  }

  protected openNewsItemDialog(event: Event, newsItem: News): void {
    event.preventDefault();
    this.dialog.open(NewsItemDialogComponent, {
      panelClass: 'dialog-sm',
      data: { newsItem: newsItem }
    });
  }
}
