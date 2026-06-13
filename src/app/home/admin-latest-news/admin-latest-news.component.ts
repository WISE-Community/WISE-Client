import { Component } from '@angular/core';
import { LatestNewsComponent } from '../latest-news/latest-news.component';
import { News } from '../../domain/news';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'admin-latest-news',
  imports: [LatestNewsComponent],
  templateUrl: './admin-latest-news.component.html',
  styleUrl: './admin-latest-news.component.scss'
})
export class AdminLatestNewsComponent {
  protected topics: News[] = [];
  protected isLoaded: boolean = false;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService.getAllNews().subscribe((news) => {
      this.topics = news
        .filter((news) => news.type === 'public')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.isLoaded = true;
    });
  }
}
