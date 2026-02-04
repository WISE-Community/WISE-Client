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
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe, MarkdownComponent, MatButton, MatIcon, MatProgressSpinner],
  templateUrl: './ai-summary-display.component.html'
})
export abstract class AiSummaryDisplayComponent extends TeacherSummaryDisplayComponent {
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
    this.summary = this.localStorageService.getItem(this.getSummaryKey()) || '';
    this.summaryTimestamp = this.localStorageService.getItem(this.getSummaryTimestampKey()) || 0;
    const lastResponseTime = latestPeriodComponentStates.reduce(
      (max, state) => Math.max(max, state.serverSaveTime),
      0
    );
    this.newSummaryAvailable =
      this.summaryTimestamp > 0 && lastResponseTime > this.summaryTimestamp;
  }

  protected getLatestPeriodComponentStates(): any[] {
    return (this.dataService as TeacherDataService)
      .getComponentStatesByComponentId(this.componentId)
      .filter((state) => state.periodId === this.periodId || this.periodId === -1)
      .sort((a, b) => a.serverSaveTime - b.serverSaveTime);
  }

  protected async generateSummary(): Promise<void> {
    this.generatingSummary = true;
    const prompt = this.projectService.getComponent(this.nodeId, this.componentId).prompt;
    this.summary = await this.awsBedRockService.sendMessage([
      new ChatMessage('system', this.getSystemPrompt(prompt), this.nodeId),
      new ChatMessage('user', this.getStudentResponses(), this.nodeId)
    ]);
    this.localStorageService.setItem(this.getSummaryKey(), this.summary);
    this.localStorageService.setItem(this.getSummaryTimestampKey(), new Date().getTime());
    this.generatingSummary = false;
    this.newSummaryAvailable = false;
  }

  protected abstract getStudentResponses(): string;

  protected abstract getSystemPrompt(prompt: string): string;

  private getSummaryKey(): string {
    return `component-summary-${this.periodId}-${this.nodeId}-${this.componentId}`;
  }

  private getSummaryTimestampKey(): string {
    return `component-summary-timestamp-${this.periodId}-${this.nodeId}-${this.componentId}`;
  }
}
