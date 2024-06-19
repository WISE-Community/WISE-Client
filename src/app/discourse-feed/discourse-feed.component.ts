import { HttpClient } from '@angular/common/http';
import { Directive, Input } from '@angular/core';

@Directive()
export abstract class DiscourseFeedComponent {
  @Input() baseUrl: string;
  @Input() category: string;
  protected isLoaded: boolean;
  @Input() queryString: string;
  protected topics: any;

  constructor(protected http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(this.getUrl()).subscribe(({ topic_list }: any) => {
      this.topics = topic_list.topics
        .filter((topic) => {
          return !topic.pinned_globally;
        })
        .slice(0, 3);
      this.isLoaded = true;
    });
  }

  private getUrl(): string {
    return `${this.baseUrl}/${this.category}.json${this.queryString ? `?${this.queryString}` : ``}`;
  }
}
