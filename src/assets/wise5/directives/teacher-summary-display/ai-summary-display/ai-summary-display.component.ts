import { Component, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AwsBedRockService } from '../../../../../app/chatbot/awsBedRock.service';
import { ChatMessage } from '../../../../../app/chatbot/chat';
import { TeacherDataService } from '../../../services/teacherDataService';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LocalStorageService } from '../../../../../app/services/localStorageService';
import { MarkdownComponent } from 'ngx-markdown';
import { DatePipe } from '@angular/common';
import { TeacherProjectService } from '../../../services/teacherProjectService';

/**
 * Abstract base class for components that use an LLM to summarize student responses.
 */
@Component({
  imports: [DatePipe, MarkdownComponent, MatButton, MatIcon, MatProgressSpinner],
  templateUrl: './ai-summary-display.component.html'
})
export abstract class AiSummaryDisplayComponent {
  @Input() componentId: string;
  @Input() nodeId: string;
  @Input() periodId: number;

  protected awsBedRockService: AwsBedRockService = inject(AwsBedRockService);
  protected dataService: TeacherDataService = inject(TeacherDataService);
  private localStorageService: LocalStorageService = inject(LocalStorageService);
  protected projectService: TeacherProjectService = inject(TeacherProjectService);

  protected generatingSummary: boolean = false;
  protected hasStudentResponses: boolean = false;
  protected latestComponentStates: any[] = [];
  protected newSummaryAvailable: boolean = false;
  protected summary: string;
  protected summaryDate: Date;

  ngOnInit(): void {
    this.latestComponentStates = this.getLatestComponentStates();
    this.hasStudentResponses = this.latestComponentStates.length > 0;
    if (!this.hasStudentResponses) {
      return;
    }
    this.summary = this.localStorageService.getItem(this.getSummaryKey()) || '';
    const summaryTime = this.localStorageService.getItem(this.getSummaryTimeKey()) || 0;
    this.summaryDate = new Date(summaryTime);
    this.newSummaryAvailable = summaryTime > 0 && this.getLastResponseTime() > summaryTime;
  }

  protected getLatestComponentStates(): any[] {
    return this.dataService
      .getComponentStatesByComponentId(this.componentId)
      .filter((state) => state.periodId === this.periodId || this.periodId === -1)
      .sort((a, b) => a.serverSaveTime - b.serverSaveTime);
  }

  private getLastResponseTime(): number {
    return this.latestComponentStates.reduce(
      (max, state) => Math.max(max, state.serverSaveTime),
      0
    );
  }

  protected async generateSummary(): Promise<void> {
    this.generatingSummary = true;
    const prompt = this.projectService.getComponent(this.nodeId, this.componentId).prompt;
    this.summary = await this.awsBedRockService.sendMessage([
      new ChatMessage('system', this.getSystemPrompt(prompt), this.nodeId),
      new ChatMessage('user', this.getStudentResponses(), this.nodeId)
    ]);
    this.localStorageService.setItem(this.getSummaryKey(), this.summary);
    const summaryTime = new Date().getTime();
    this.localStorageService.setItem(this.getSummaryTimeKey(), summaryTime);
    this.summaryDate = new Date(summaryTime);
    this.generatingSummary = false;
    this.newSummaryAvailable = false;
  }

  protected abstract getStudentResponses(): string;

  protected abstract getSystemPrompt(prompt: string): string;

  private getSummaryKey(): string {
    return `component-summary-${this.periodId}-${this.nodeId}-${this.componentId}`;
  }

  private getSummaryTimeKey(): string {
    return `component-summary-time-${this.periodId}-${this.nodeId}-${this.componentId}`;
  }
}
