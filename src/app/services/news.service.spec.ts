import { TestBed } from '@angular/core/testing';

import { NewsService } from './news.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { News } from '../domain/news';

let service: NewsService;
describe('NewsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(NewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should properly format News date', () => {
    const news = new News({
      id: 1,
      date: '2026-10-01 19:14:23.0',
      type: 'public',
      title: 'Test News',
      news: 'news content',
      owner: undefined
    });
    const date = service.formatNewsDate(news);
    expect(date).toBe('10/1/26');
  });
});
