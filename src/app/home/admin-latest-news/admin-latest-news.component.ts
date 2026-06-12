import { Component } from '@angular/core';
import { News } from '../../domain/news';
import { NewsService } from '../../services/news.service';
import { LatestNewsComponent } from '../latest-news/latest-news.component';

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
      this.topics = news.slice(0, 3);
      this.isLoaded = true;
    });
  }
}
