import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AdminLatestNewsComponent } from './admin-latest-news.component';
import { NewsService } from '../../services/news.service';
import { News } from '../../domain/news';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';

describe('AdminLatestNewsComponent', () => {
  let component: AdminLatestNewsComponent;
  let fixture: ComponentFixture<AdminLatestNewsComponent>;

  beforeEach(async () => {
    const newsServiceSpy = jasmine.createSpyObj<NewsService>(['getNews']);
    const news1 = new News({
      id: 1,
      date: '2026-02-01 19:14:23.0',
      type: 'public',
      title: 'Test News',
      news: 'news content',
      owner: undefined
    });
    const news2 = new News({
      id: 2,
      date: '2026-01-02 19:14:23.0',
      type: 'teacherOnly',
      title: 'Test News 2',
      news: 'news content 2',
      owner: undefined
    });
    const news3 = new News({
      id: 3,
      date: '2026-02-01 19:15:00.0',
      type: 'public',
      title: 'Test News 3',
      news: 'news content 3',
      owner: undefined
    });

    newsServiceSpy.getNews.and.callFake(() => of<News[]>([news1, news2, news3]));

    await TestBed.configureTestingModule({
      imports: [AdminLatestNewsComponent],
      providers: [{ provide: NewsService, useValue: newsServiceSpy }, MockProvider(ActivatedRoute)]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLatestNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter and sort topics', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component['topics']).toBeTruthy();
    expect(component['topics'].length).toBe(2);
    expect(component['topics'][0].title).toBe('Test News 3');
  }));
});
