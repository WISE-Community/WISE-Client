import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DiscourseLatestNewsComponent } from './discourse-latest-news.component';

describe('DiscourseLatestNewsComponent', () => {
  let component: DiscourseLatestNewsComponent;
  let http: HttpTestingController;
  const sampleLatestResponse = {
    users: [],
    topic_list: {
      topics: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DiscourseLatestNewsComponent]
    });
    component = TestBed.inject(DiscourseLatestNewsComponent);
    http = TestBed.inject(HttpTestingController);
  });

  it('should create and show 3 latest topics', () => {
    component.discourseURL = 'http://localhost:9292';
    component.category = 'c/news/1';
    component.ngOnInit();
    http
      .expectOne(`${component.discourseURL}/${component.category}.json?order=latest`)
      .flush(sampleLatestResponse);
    expect(component.topics.length).toEqual(3);
  });
});
