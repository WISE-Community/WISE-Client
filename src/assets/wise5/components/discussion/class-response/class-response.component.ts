import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ConfigService } from '../../../services/configService';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { SaveTimeMessageComponent } from '../../../common/save-time-message/save-time-message.component';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [
    CdkTextareaAutosize,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    SaveTimeMessageComponent,
    TextFieldModule
  ],
  selector: 'class-response',
  styleUrl: 'class-response.component.scss',
  templateUrl: 'class-response.component.html'
})
export class ClassResponse {
  protected expanded: boolean = false;
  @Input() isDisabled: boolean;
  @Input() mode: any;
  @Input() numReplies: number;
  protected repliesToShow: any[] = [];
  @Input() response: any;
  @Output() submitButtonClicked: any = new EventEmitter();
  private urlMatcher: any =
    /((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)/g;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.injectLinksIntoResponse();
    this.injectLinksIntoReplies();
    if (this.hasAnyReply()) {
      this.showLastReply();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.numReplies != null && !changes.numReplies.isFirstChange()) {
      this.expanded = true;
      this.injectLinksIntoReplies();
      this.showAllReplies();
    }
  }

  private injectLinksIntoResponse(): void {
    this.response.studentData.responseTextHTML = this.injectLinks(
      this.response.studentData.response
    );
  }

  private injectLinksIntoReplies(): void {
    this.response.replies.forEach((replyComponentState: any): void => {
      replyComponentState.studentData.responseHTML = this.injectLinks(
        replyComponentState.studentData.response
      );
    });
  }

  private injectLinks(response: string): string {
    return response.replace(this.urlMatcher, (match) => {
      let matchUrl = match;
      if (!match.startsWith('http')) {
        /*
         * The url does not begin with http so we will add // to the beginning of it so that the
         * browser treats the url as an absolute link and not a relative link. The browser will also
         * use the same protocol that the current page is loaded with (http or https).
         */
        matchUrl = '//' + match;
      }
      return `<a href="${matchUrl}" target="_blank">${match}</a>`;
    });
  }

  protected getAvatarColorForWorkgroupId(workgroupId: number): string {
    return getAvatarColorForWorkgroupId(workgroupId);
  }

  protected adjustClientSaveTime(time: any): number {
    return this.configService.convertToClientTimestamp(time);
  }

  protected replyEntered($event: any): void {
    if (this.isEnterKeyEvent($event)) {
      $event.preventDefault();
      this.response.replyText = this.removeLastChar(this.response.replyText);
      this.expandAndShowAllReplies();
      this.submitButtonClicked.emit(this.response);
    }
  }

  protected isEnterKeyEvent(event: any): boolean {
    return event.keyCode == 13 && !event.shiftKey && this.response.replyText;
  }

  private removeLastChar(responseText: string): string {
    return responseText.substring(0, responseText.length - 1);
  }

  protected toggleExpanded(): void {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.showAllReplies();
    } else {
      this.showLastReply();
    }
  }

  private hasAnyReply(): boolean {
    return this.response.replies.length > 0;
  }

  private showLastReply(): void {
    if (this.response.replies.length > 0) {
      this.repliesToShow = [this.response.replies[this.response.replies.length - 1]];
    }
  }

  private showAllReplies(): void {
    this.repliesToShow = this.response.replies;
  }

  private expandAndShowAllReplies(): void {
    this.expanded = true;
    this.showAllReplies();
  }
}
