import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { News } from '../domain/news';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private allNewsEndpoint = '/api/news';
  private homeNewsEndpoint = '/api/news/home';

  constructor(private http: HttpClient) {}

  getAllNews(numItems?: number, type?: string): Observable<News[]> {
    const params = this.buildUrlParams(numItems, type);
    return this.getNews(this.allNewsEndpoint, params);
  }

  getHomePageNews(type?: string): Observable<News[]> {
    const params = this.buildUrlParams(undefined, type);
    return this.getNews(this.homeNewsEndpoint, params);
  }

  private getNews(endpoint: string, params: HttpParams): Observable<News[]> {
    const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
    return this.http.get(endpoint, { headers: headers, params: params }) as Observable<News[]>;
  }

  private buildUrlParams(numItems?: number, type?: string): HttpParams {
    let params = new HttpParams();
    if (numItems) {
      params = params.set('num', numItems.toString());
    }
    if (type) {
      params = params.set('type', type);
    }
    return params;
  }
}
