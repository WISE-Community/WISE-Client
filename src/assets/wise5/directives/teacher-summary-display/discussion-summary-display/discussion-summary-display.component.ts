import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MarkdownComponent } from 'ngx-markdown';
import { AiSummaryDisplayComponent } from '../ai-summary-display/ai-summary-display.component';
import { DatePipe } from '@angular/common';

interface Thread {
  id: number;
  post: string;
  replies: string[];
}

@Component({
  imports: [DatePipe, MarkdownComponent, MatButton, MatIcon, MatProgressSpinner],
  selector: 'discussion-summary-display',
  templateUrl: '../ai-summary-display/ai-summary-display.component.html'
})
export class DiscussionSummaryDisplayComponent extends AiSummaryDisplayComponent {
  protected getSystemPrompt(prompt: string): string {
    return `You are a teacher who is summarizing students' discussion threads, which include posts and replies to the following question: "${prompt}".
      Each thread is in the format: <thread><post>Post</post><replies><reply>Reply 1</reply><reply>Reply 2</reply></replies></thread>.
      In the same language as the question, provide a summary of the threads in 100 words or less.`;
  }

  protected getStudentResponses(): string {
    return this.getDiscussionThreads().reduce(
      (soFar, thread) =>
        `${soFar}<thread><post>${thread.post}</post><replies>${thread.replies.map((reply) => `<reply>${reply}</reply>`).join('')}</replies></thread>`,
      ''
    );
  }

  private getDiscussionThreads(): Thread[] {
    const states = this.getLatestPeriodComponentStates();
    const threads = states
      .filter((state) => state.studentData.componentStateIdReplyingTo == null)
      .map((post) => ({ id: post.id, post: post.studentData.response, replies: [] }));
    states
      .filter((state) => state.studentData.componentStateIdReplyingTo != null)
      .forEach((reply) => {
        threads
          .find((t) => t.id === reply.studentData.componentStateIdReplyingTo)
          ?.replies.push(reply.studentData.response);
      });
    return threads;
  }
}
