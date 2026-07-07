import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { News } from '../domain/news';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsEndpoint = '/api/news';
  private homePageNewsEndpoint = '/api/news/home';

  constructor(private http: HttpClient) {}

  getAllNews(numItems?: number, type?: string): Observable<News[]> {
    const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
    const params = this.buildUrlParams(numItems, type);
    return this.http.get(this.newsEndpoint, { headers: headers, params: params }) as Observable<
      News[]
    >;
  }

  getHomePageNews(type?: string): Observable<News[]> {
    const headers = new HttpHeaders({ 'Cache-Control': 'no-cache' });
    const params = this.buildUrlParams(undefined, type);
    return this.http.get(this.homePageNewsEndpoint, {
      headers: headers,
      params: params
    }) as Observable<News[]>;
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
