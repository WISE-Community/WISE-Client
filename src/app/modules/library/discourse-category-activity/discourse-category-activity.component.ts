import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, FlexLayoutModule, MatDividerModule, MatIconModule],
  selector: 'discourse-category-activity',
  standalone: true,
  styleUrl: 'discourse-category-activity.component.scss',
  templateUrl: 'discourse-category-activity.component.html'
})
export class DiscourseCategoryActivityComponent {
  @Input() categoryURL: string = '';
  protected discourseBaseUrl: string = '';
  protected hasMoreTopics: boolean;
  protected postCount: number = 0;
  protected topics: any[] = [];
  protected validCategoryURL: boolean;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.retrieveCategory();
  }

  private retrieveCategory(): void {
    this.http.get(`${this.categoryURL}.json?order=latest`).subscribe(({ topic_list }: any) => {
      if (topic_list.topics) {
        this.validCategoryURL = true;
        this.topics = topic_list.topics;
        this.postCount = this.topics.reduce((sum, topic) => sum + topic.posts_count, 0);
        this.discourseBaseUrl = this.categoryURL.match(/(.+)\/c\/.+/)[1];
        this.hasMoreTopics = topic_list.more_topics_url ? true : false;
      }
    });
  }
}
