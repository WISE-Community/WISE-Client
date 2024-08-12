import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscourseLatestNewsComponent } from './discourse-latest-news.component';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DiscourseLatestNewsComponent', () => {
  let component: DiscourseLatestNewsComponent;
  let fixture: ComponentFixture<DiscourseLatestNewsComponent>;
  let http: HttpTestingController;
  const sampleLatestResponse = {
    users: [],
    topic_list: {
      topics: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [DiscourseLatestNewsComponent, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DiscourseLatestNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show 3 latest topics', () => {
    component.baseUrl = 'http://localhost:9292';
    component.category = 'c/news/1';
    component.queryString = 'order=latest';
    component.ngOnInit();
    http
      .expectOne(`${component.baseUrl}/${component.category}.json?${component.queryString}`)
      .flush(sampleLatestResponse);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('li')).length).toEqual(3);
  });
});
