import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { News } from '../domain/news';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsUrl = '/api/news';

  constructor(private http: HttpClient) {}

  getAllNews(): Observable<News[]> {
    const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
    return this.http.get(this.newsUrl, { headers: headers }) as Observable<News[]>;
  }

  formatNewsDate(news: News): string {
    const removeLeadingZero = (str: string) => str.replace(/^0+/, '');

    const month = removeLeadingZero(news.date.slice(5, 7));
    const day = removeLeadingZero(news.date.slice(8, 10));
    const year = news.date.slice(2, 4);

    return `${month}/${day}/${year}`;
  }
}
