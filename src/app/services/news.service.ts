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

  getNewsPageNews(type: string): Observable<News[]> {
    const params = this.buildUrlParams(type);
    return this.getNews(this.allNewsEndpoint, params);
  }

  getHomePageNews(type: string): Observable<News[]> {
    const params = this.buildUrlParams(type);
    return this.getNews(this.homeNewsEndpoint, params);
  }

  private getNews(endpoint: string, params: HttpParams): Observable<News[]> {
    const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
    return this.http.get(endpoint, { headers: headers, params: params }) as Observable<News[]>;
  }

  private buildUrlParams(type: string): HttpParams {
    let params = new HttpParams();
    params = params.set('type', type);
    return params;
  }
}
