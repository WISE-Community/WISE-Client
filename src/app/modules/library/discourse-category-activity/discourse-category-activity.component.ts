import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'discourse-category-activity',
  templateUrl: 'discourse-category-activity.component.html',
  styleUrls: ['discourse-category-activity.component.scss']
})
export class DiscourseCategoryActivityComponent {
  @Input()
  categoryURL: string = '';

  discourseBaseUrl: string = '';
  hasMoreTopics: boolean = false;
  isValidCategoryURL: boolean = false;
  postCount: number = 0;
  topics: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.retrieveCategory();
  }

  retrieveCategory(): void {
    this.http.get(`${this.categoryURL}.json?order=latest`).subscribe(({ topic_list }: any) => {
      if (topic_list.topics) {
        this.isValidCategoryURL = true;
        this.topics = topic_list.topics;
        this.postCount = this.countPosts();
        this.discourseBaseUrl = this.categoryURL.match(/(.+)\/c\/.+/)[1];
        this.hasMoreTopics = topic_list.more_topics_url ? true : false;
      }
    });
  }

  countPosts(): number {
    let postCount = 0;
    this.topics.forEach((topic) => {
      postCount += topic.posts_count;
    });
    return postCount;
  }
}
