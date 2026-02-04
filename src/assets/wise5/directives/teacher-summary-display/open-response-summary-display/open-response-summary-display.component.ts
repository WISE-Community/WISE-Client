import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TeacherDataService } from '../../../services/teacherDataService';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MarkdownComponent } from 'ngx-markdown';
import { AiSummaryDisplayComponent } from '../ai-summary-display/ai-summary-display.component';

@Component({
  imports: [DatePipe, MarkdownComponent, MatButton, MatIcon, MatProgressSpinner],
  selector: 'open-response-summary',
  templateUrl: '../ai-summary-display/ai-summary-display.component.html'
})
export class OpenResponseSummaryDisplayComponent extends AiSummaryDisplayComponent {
  protected getSystemPrompt(prompt: string): string {
    return `You are a teacher who is summarizing student responses to the following question: "${prompt}".
      Each student response is in the format: <response>Response</response>.
      In the same language as the question, provide a summary of the responses in 100 words or less.`;
  }

  protected getStudentResponses(): string {
    return this.getLatestPeriodComponentStates().reduce(
      (soFar, state) => `${soFar}<response>${state.studentData.response}</response>`,
      ''
    );
  }
  protected getLatestPeriodComponentStates(): any[] {
    return (this.dataService as TeacherDataService)
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
