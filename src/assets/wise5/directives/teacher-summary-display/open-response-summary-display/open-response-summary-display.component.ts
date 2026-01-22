import { Component, inject } from '@angular/core';
import { TeacherSummaryDisplayComponent } from '../teacher-summary-display.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AwsBedRockService } from '../../../../../app/chatbot/awsBedRock.service';
import { ChatMessage } from '../../../../../app/chatbot/chat';
import { TeacherDataService } from '../../../services/teacherDataService';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LocalStorageService } from '../../../../../app/services/localStorageService';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  imports: [MarkdownComponent, MatButton, MatIcon, MatProgressSpinner],
  selector: 'open-response-summary',
  templateUrl: './open-response-summary-display.component.html'
})
export class OpenResponseSummaryDisplayComponent extends TeacherSummaryDisplayComponent {
  protected awsBedRockService: AwsBedRockService = inject(AwsBedRockService);
  protected generatingSummary: boolean = false;
  protected hasStudentResponses: boolean = false;
  private localStorageService: LocalStorageService = inject(LocalStorageService);
  protected newSummaryAvailable: boolean = false;
  protected summary: string;
  private summaryTimestamp: number;

  ngOnInit(): void {
    this.renderDisplay();
  }

  protected renderDisplay(): void {
    super.renderDisplay();
    const latestPeriodComponentStates = this.getLatestPeriodComponentStates();
    this.hasStudentResponses = latestPeriodComponentStates.length > 0;
    if (!this.hasStudentResponses) {
      return;
    }
    this.summary =
      this.localStorageService.getItem(
        `openResponseSummary-${this.periodId}-${this.nodeId}-${this.componentId}`
      ) || '';
    this.summaryTimestamp =
      this.localStorageService.getItem(
        `openResponseSummary-timestamp-${this.periodId}-${this.nodeId}-${this.componentId}`
      ) || 0;
    const lastResponseTime = latestPeriodComponentStates.reduce((max, state) => {
      return Math.max(max, state.serverSaveTime);
    }, 0);
    this.newSummaryAvailable =
      this.summaryTimestamp > 0 && lastResponseTime > this.summaryTimestamp;
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

  protected async generateSummary(): Promise<void> {
    this.generatingSummary = true;
    const prompt = this.projectService.getComponent(this.nodeId, this.componentId).prompt;
    const systemPrompt = `You are a teacher who is summarizing student responses to the following question: "${prompt}".
      Each student response is in the format: <response>Response</response>.
      In the same language as the question, provide a summary of the responses in 100 words or less.`;
    const messages = [
      new ChatMessage('system', systemPrompt, this.nodeId),
      new ChatMessage('user', this.getStudentResponses(), this.nodeId)
    ];
    this.summary = await this.awsBedRockService.sendMessage(messages);
    this.localStorageService.setItem(
      `openResponseSummary-${this.periodId}-${this.nodeId}-${this.componentId}`,
      this.summary
    );
    this.localStorageService.setItem(
      `openResponseSummary-timestamp-${this.periodId}-${this.nodeId}-${this.componentId}`,
      new Date().getTime()
    );
    this.generatingSummary = false;
    this.newSummaryAvailable = false;
  }

  private getStudentResponses(): string {
    return this.getLatestPeriodComponentStates().reduce(
      (soFar, state) => `${soFar}<response>${state.studentData.response}</response>`,
      ''
    );
  }
}
