import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownComponent } from 'ngx-markdown';
import { AiSummaryComponent } from '../ai-summary/ai-summary.component';
import { DiscussionService } from '../../../components/discussion/discussionService';

interface Thread {
  id: number;
  post: string;
  replies: string[];
}

/**
 * Uses an LLM to summarize student discussion threads.
 */
@Component({
  imports: [MarkdownComponent, MatButton, MatIcon, MatProgressSpinner, MatTooltipModule],
  providers: [DatePipe],
  selector: 'discussion-ai-summary',
  templateUrl: '../ai-summary/ai-summary.component.html'
})
export class DiscussionAiSummaryComponent extends AiSummaryComponent {
  private discussionService = inject(DiscussionService);

  protected getDefaultSystemPrompt(): string {
    return this.discussionService.getDefaultTeacherSummarySystemPrompt();
  }

  protected getResponseFormat(): string {
    return '<thread><post>Post</post><replies><reply>Reply 1</reply><reply>Reply 2</reply></replies></thread>';
  }

  protected getStudentResponses(): string {
    return this.getDiscussionThreads().reduce(
      (soFar, thread) =>
        `${soFar}<thread><post>${thread.post}</post><replies>${thread.replies.map((reply) => `<reply>${reply}</reply>`).join('')}</replies></thread>`,
      ''
    );
  }

  private getDiscussionThreads(): Thread[] {
    const threads = this.latestComponentStates
      .filter((state) => state.studentData.componentStateIdReplyingTo == null)
      .map((post) => ({ id: post.id, post: post.studentData.response, replies: [] }));
    this.latestComponentStates
      .filter((state) => state.studentData.componentStateIdReplyingTo != null)
      .forEach((reply) => {
        threads
          .find((t) => t.id === reply.studentData.componentStateIdReplyingTo)
          ?.replies.push(reply.studentData.response);
      });
    return threads;
  }

  protected override get summaryCaption(): string {
    return $localize`Summary generated ${this.datePipe.transform(this.summaryDate, 'short')} from ${this.latestComponentStates.length} posts and comments`;
  }
}
