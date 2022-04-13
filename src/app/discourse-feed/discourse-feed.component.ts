import { HttpClient } from '@angular/common/http';
import { Directive, Input } from '@angular/core';

@Directive()
export abstract class DiscourseFeedComponent {
  @Input()
  baseUrl: string;

  @Input()
  category: string;

  @Input()
  queryString: string;

  topics: any;
  isLoaded: boolean = false;

  constructor(protected http: HttpClient) {}

  ngOnInit() {
    const url = this.getUrl();
    this.http
      .get(url)
      .subscribe(({ topic_list, users }: any) => {
        this.topics = topic_list.topics
          .filter((topic) => {
            return !topic.pinned_globally;
          })
          .slice(0, 3);
          this.isLoaded = true;
      });
  }

  getUrl(): string {
    return `${this.baseUrl}/${this.category}.json${
        this.queryString ? `?${this.queryString}` : ``}`;
  }
}
