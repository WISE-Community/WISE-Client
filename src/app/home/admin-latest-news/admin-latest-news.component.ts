import { Component } from '@angular/core';
import { LatestNewsComponent } from '../latest-news/latest-news.component';
import { News } from '../../domain/news';
import { NewsService } from '../../services/news.service';

@Component({
  imports: [LatestNewsComponent],
  selector: 'admin-latest-news',
  templateUrl: './admin-latest-news.component.html'
})
export class AdminLatestNewsComponent {
  protected loaded: boolean = false;
  protected topics: News[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getAllNews().subscribe((news) => {
      this.topics = news
        .filter((news) => news.type === 'public')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.loaded = true;
    });
  }
}
