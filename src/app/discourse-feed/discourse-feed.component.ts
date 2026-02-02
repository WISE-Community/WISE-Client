import { HttpClient } from '@angular/common/http';
import { Directive, inject, Input } from '@angular/core';

@Directive()
export abstract class DiscourseFeedComponent {
  protected http = inject(HttpClient);

  @Input() baseUrl: string;
  @Input() category: string;
  protected isLoaded: boolean;
  @Input() queryString: string;
  protected topics: any;

  ngOnInit(): void {
    this.http.get(this.getUrl()).subscribe(({ topic_list }: any) => {
      this.topics = topic_list.topics.filter((topic) => !topic.pinned_globally).slice(0, 3);
      this.isLoaded = true;
    });
  }

  private getUrl(): string {
    return `${this.baseUrl}/${this.category}.json${this.queryString ? `?${this.queryString}` : ``}`;
  }
}
