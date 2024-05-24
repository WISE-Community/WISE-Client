import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscourseCategoryActivityComponent } from './discourse-category-activity.component';
import { By } from '@angular/platform-browser';

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
  });

  afterEach(() => {
    fixture.destroy();
  });

  ngOnInit();
});

function ngOnInit() {
  describe('ngOnInit()', () => {
    it('should make request to fetch posts and show discussion links', () => {
      component.categoryURL = 'http://localhost:9292/c/7';
      component.ngOnInit();
      http.expectOne(`${component.categoryURL}.json?order=latest`).flush(sampleDiscourseResponse);
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('a')).length).toEqual(4);
    });
  });
}
