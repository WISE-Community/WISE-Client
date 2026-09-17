import { Directive, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Directive()
export abstract class DiscourseFeedComponent {
  @Input() baseUrl: string;
  @Input() category: string;
  protected loaded: boolean;
  @Input() queryString: string;
  protected topics: any;

  constructor(protected http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(this.getUrl()).subscribe(({ topic_list }: any) => {
      this.topics = topic_list.topics
        .filter((topic: any) => !(topic.pinned_globally || topic.archived))
        .slice(0, 3);
      this.loaded = true;
    });
  }

  private getUrl(): string {
    return `${this.baseUrl}/${this.category}.json${this.queryString ? `?${this.queryString}` : ``}`;
  }
}
