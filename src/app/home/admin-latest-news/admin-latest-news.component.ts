import { Component } from '@angular/core';
import { LatestNewsComponent } from '../latest-news/latest-news.component';
import { News } from '../../domain/news';
import { NewsService } from '../../services/news.service';
import { UserService } from '../../services/user.service';

@Component({
  imports: [LatestNewsComponent],
  selector: 'admin-latest-news',
  templateUrl: './admin-latest-news.component.html'
})
export class AdminLatestNewsComponent {
  protected loaded: boolean = false;
  private numberOfNewsItems = 3;
  protected topics: News[] = [];

  constructor(
    private newsService: NewsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const newsType = this.userService.isSignedIn() ? undefined : 'public';
    this.retrieveNews(newsType);
  }

  private retrieveNews(newsType: string | undefined) {
    this.newsService.getNews(this.numberOfNewsItems, newsType).subscribe((news) => {
      this.topics = news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.loaded = true;
    });
  }
}
