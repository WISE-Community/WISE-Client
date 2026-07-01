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

  getNews(numItems?: number, type?: string): Observable<News[]> {
    const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
    const url = this.buildUrlWithParams(numItems, type);
    return this.http.get(url, { headers: headers }) as Observable<News[]>;
  }

  private buildUrlWithParams(numItems?: number, type?: string): string {
    if (numItems && type) {
      return `${this.newsUrl}?num=${numItems}&type=${type}`;
    } else if (numItems) {
      return `${this.newsUrl}?num=${numItems}`;
    } else if (type) {
      return `${this.newsUrl}?type=${type}`;
    } else {
      return this.newsUrl;
    }
  }
}
