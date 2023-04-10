import { Component, Input } from '@angular/core';
import { ConfigService } from '../../services/configService';

@Component({
  selector: 'concurrent-authors-message',
  templateUrl: 'concurrent-authors-message.component.html'
})
export class ConcurrentAuthorsMessageComponent {
  @Input() authors: string[] = [];
  message: string = '';

  constructor(private configService: ConfigService) {}

  ngOnChanges() {
    this.authors.splice(this.authors.indexOf(this.configService.getMyUsername()), 1);
    this.message =
      this.authors.length > 0
        ? $localize`Also currently editing this unit: ${this.authors.join(
            ', '
          )}. Be careful not to overwrite each other's work!`
        : '';
  }
}
