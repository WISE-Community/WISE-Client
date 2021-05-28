import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscourseCategoryActivityComponent } from './discourse-category-activity.component';

let component: DiscourseCategoryActivityComponent;
let http: HttpTestingController;
let fixture: ComponentFixture<DiscourseCategoryActivityComponent>;
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

describe('DiscourseCategoryActivityComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DiscourseCategoryActivityComponent]
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DiscourseCategoryActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  retrieveCategory();
});

function retrieveCategory() {
  xdescribe('retrieveCategory()', () => {
    it('should set discussion links and post count when request succeeds', () => {
      component.categoryURL = 'http://localhost:9292';
      component.retrieveCategory();
      http.expectOne(`${component.categoryURL}.json?order=latest`).flush(sampleDiscourseResponse);
      expect(component.isValidCategoryURL).toBeTrue();
      expect(component.topics.length).toEqual(3);
      expect(component.postCount).toEqual(8);
    });

    it('should set isValidCategoryURL to false on network error', () => {
      component.categoryURL = 'http://invalid_url';
      component.retrieveCategory();
      http
        .expectOne(`${component.categoryURL}.json?order=latest`)
        .error(new ErrorEvent('404 error'));
      expect(component.isValidCategoryURL).toBeFalse();
    });
  });
}
