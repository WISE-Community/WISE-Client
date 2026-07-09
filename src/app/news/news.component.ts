import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { News } from '../domain/news';
import { NewsService } from '../services/news.service';
import { TimelineComponent } from '../modules/timeline/timeline/timeline.component';
import {
  TimelineItemComponent,
  TimelineItemLabel,
  TimelineItemContent
} from '../modules/timeline/timeline-item/timeline-item.component';
import { UserService } from '../services/user.service';

@Component({
  imports: [
    DatePipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    TimelineComponent,
    TimelineItemComponent,
    TimelineItemContent,
    TimelineItemLabel
  ],
  selector: 'app-news',
  templateUrl: './news.component.html'
})
export class NewsComponent implements OnInit {
  newsItems: any = [];
  newsShowMore: boolean[] = [];
  showAll: boolean = false;
  showTeacherNews: boolean = false;

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    protected sanitizer: DomSanitizer,
    private userService: UserService
  ) {}

  ngOnInit() {
    const newsType = this.userService.isSignedIn() ? 'publicAndTeacher' : 'publicOnly';
    this.retrieveNews(newsType);
  }

  private retrieveNews(newsType: string): void {
    this.newsService.getNewsPageNews(newsType).subscribe((news: News[]) => {
      this.newsItems = news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.newsShowMore = new Array(this.newsItems.length).fill(false);
      this.scrollToFragmentNewsItem();
    });
  }

  private scrollToFragmentNewsItem() {
    setTimeout(() => {
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        document.getElementById(fragment)?.scrollIntoView();
      }
    });
  }

  protected newsOverLengthLimit(news: News): boolean {
    return news.news.split(' ').length > 75;
  }

  protected abbreviateNews(news: News): string {
    const words = news.news.split(' ');
    return words.slice(0, 75).join(' ') + '...';
  }

  protected expandNews(event: Event, index: number): void {
    event.preventDefault();
    this.newsShowMore[index] = true;
  }
}
