import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DiscourseFeedComponent } from './discourse-feed.component';

describe('DiscourseFeedComponent', () => {
  let component: DiscourseFeedComponent;
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
      providers: [DiscourseFeedComponent]
    });
    component = TestBed.inject(DiscourseFeedComponent);
    http = TestBed.inject(HttpTestingController);
  });

  it('should create and show 3 latest topics', () => {
    component.baseUrl = 'http://localhost:9292';
    component.category = 'c/news/1';
    component.queryString = 'order=latest';
    component.ngOnInit();
    http
      .expectOne(`${component.baseUrl}/${component.category}.json?${component.queryString}`)
      .flush(sampleLatestResponse);
    expect(component.topics.length).toEqual(3);
  });
});
