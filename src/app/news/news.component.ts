import { Component, OnInit, inject } from '@angular/core';
import { NewsService } from '../services/news.service';
import { News } from '../domain/news';
import { DomSanitizer } from '@angular/platform-browser';
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
  private newsService = inject(NewsService);
  protected sanitizer = inject(DomSanitizer);

  allNewsItems: any = [];
  showAll: boolean = false;

  ngOnInit(): void {
    this.newsService.getAllNews().subscribe((allNewsItems: News[]) => {
      this.allNewsItems = allNewsItems;
    });
  }
}
