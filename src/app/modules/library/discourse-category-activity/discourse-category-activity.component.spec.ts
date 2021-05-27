import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DiscourseCategoryActivityComponent } from './discourse-category-activity.component';

describe('DiscourseCategoryActivityComponent', () => {
  let component: DiscourseCategoryActivityComponent;
  let http: HttpTestingController;
  const sampleDiscourseResponse = {
    users: [],
    topic_list: {
      topics: [
        { id: 1, posts_count: 2 },
        { id: 2, posts_count: 2 },
        { id: 3, posts_count: 4 }
      ]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DiscourseCategoryActivityComponent]
    });
    component = TestBed.inject(DiscourseCategoryActivityComponent);
    http = TestBed.inject(HttpTestingController);
  });

  it('should show discussion links and post count', () => {
    component.categoryURL = 'http://localhost:9292';
    component.ngOnInit();
    http.expectOne(`${component.categoryURL}.json?order=latest`).flush(sampleDiscourseResponse);
    expect(component.topics.length).toEqual(3);
    expect(component.postCount).toEqual(8);
  });
});
