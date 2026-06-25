import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../services/news.service';
import { News } from '../domain/news';
// import { DomSanitizer } from '@angular/platform-browser';
import { MatIcon } from '@angular/material/icon';
import { TimelineComponent } from '../modules/timeline/timeline/timeline.component';
import {
  TimelineItemComponent,
  TimelineItemLabel,
  TimelineItemContent
} from '../modules/timeline/timeline-item/timeline-item.component';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [
    MatIcon,
    TimelineComponent,
    TimelineItemComponent,
    TimelineItemLabel,
    TimelineItemContent,
    MatCard,
    MatCardContent,
    MatButton,
    DatePipe
  ],
  selector: 'app-news',
  templateUrl: './news.component.html'
})
export class NewsComponent implements OnInit {
  allNewsItems: any = [];
  newsShowMore: boolean[] = [];
  showAll: boolean = false;
  showTeacherNews: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private userService: UserService
    // protected sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.showTeacherNewsIfLoggedIn();
    this.retrieveNews();
  }

  private showTeacherNewsIfLoggedIn(): void {
    this.userService.getUser().subscribe((user) => {
      this.showTeacherNews = user && user.roles?.length > 0;
    });
  }

  private retrieveNews(): void {
    this.newsService.getAllNews().subscribe((allNewsItems: News[]) => {
      this.prepareNewsItems(allNewsItems);
      this.newsShowMore = new Array(this.allNewsItems.length).fill(false);
      this.scrollToFragmentNewsItem();
    });
  }

  private prepareNewsItems(allNewsItems: News[]) {
    this.allNewsItems = allNewsItems
      .filter((newsItem) => this.showTeacherNews || newsItem.type === 'public')
      .reverse();
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
