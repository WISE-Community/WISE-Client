import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownComponent } from 'ngx-markdown';
import { AiSummaryComponent } from '../ai-summary/ai-summary.component';

/**
 * Uses an LLM to summarize students' responses to open response questions.
 */
@Component({
  imports: [MarkdownComponent, MatButton, MatIcon, MatProgressSpinner, MatTooltipModule],
  providers: [DatePipe],
  selector: 'open-response-ai-summary',
  templateUrl: '../ai-summary/ai-summary.component.html'
})
export class OpenResponseAiSummaryComponent extends AiSummaryComponent {
  protected getSystemPrompt(prompt: string): string {
    return `You are a teacher who is summarizing student responses to the following question: "${prompt}".
      Each student response is in the format: <response>Response</response>.
      In the same language as the question, provide a summary of the responses in 100 words or less.`;
  }

  protected getStudentResponses(): string {
    return this.getLatestComponentStates().reduce(
      (soFar, state) => `${soFar}<response>${state.studentData.response}</response>`,
      ''
    );
  }
  protected getLatestComponentStates(): any[] {
    return this.dataService
      .getComponentStatesByComponentId(this.componentId)
      .filter((state) => state.periodId === this.periodId || this.periodId === -1)
      .sort((a, b) => a.serverSaveTime - b.serverSaveTime)
      .reduceRight(
        (soFar, currentState) =>
          soFar.find((state) => state.workgroupId === currentState.workgroupId)
            ? soFar
            : soFar.concat(currentState),
        []
      );
  }
}
