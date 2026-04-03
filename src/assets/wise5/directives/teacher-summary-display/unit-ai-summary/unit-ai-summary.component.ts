import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownComponent } from 'ngx-markdown';
import { AiSummaryComponent } from '../ai-summary/ai-summary.component';
import { ChatMessage } from '../../../../../app/chatbot/chat';
import { ChatService } from '../../../../../app/services/chat/chat.service';
import { OpenAiChatService } from '../../../../../app/services/chat/openAiChat.service';

/**
 * Uses an LLM to summarize and find trends in the progress of the entire class in a unit.
 */
@Component({
  imports: [MarkdownComponent, MatButton, MatIcon, MatProgressSpinner, MatTooltipModule],
  providers: [DatePipe],
  selector: 'unit-ai-summary',
  templateUrl: '../ai-summary/ai-summary.component.html'
})
export class UnitAiSummaryComponent extends AiSummaryComponent {
  protected getSystemPrompt(prompt: string): string {
    //return `You are a teacher who is summarizing student responses to the following question: "${prompt}".
    //  Each student response is in the format: <response>Response</response>.
    //  In the same language as the question, provide a summary of the responses in 100 words or less.`;
    return `Find any trends or things of note in the unit progression for this class. 
            In the same language as the unit, provide a summary of your findings in 250 words or less.`;
  }

  // responses + progress?
  protected getStudentResponses(): string {
    return this.getLatestComponentStates().reduce(
      (soFar, state) => `${soFar}<response>${state.studentData.response}</response>`,
      ''
    );
  }
  protected getLatestComponentStates(): any[] {
    const componentStates = [];
    this.getUnitComponents().forEach((component) => {
      componentStates.concat(
        this.dataService
          .getComponentStatesByComponentId(component.id)
          .filter((state) => state.periodId === this.periodId || this.periodId === -1)
          .sort((a, b) => a.serverSaveTime - b.serverSaveTime)
          .reduceRight(
            (soFar, currentState) =>
              soFar.find((state) => state.workgroupId === currentState.workgroupId)
                ? soFar
                : soFar.concat(currentState),
            []
          )
      );
    });
    return componentStates;
  }

  private getUnitComponents(): any[] {
    return this.projectService
      .getNodesInOrder()
      .filter((node) => this.projectService.getNodeById(node.id).type === 'node')
      .reduce((acc, val) => acc.concat(val), []);
  }

  // //TODO: UNIT SUMMARY CYCLES THROUGH ALL NODES? node.type = "node"
  // protected async generateSummary(): Promise<void> {
  //   this.generatingSummary = true;
  //   const chatMessages = this.buildChatMessagesFromAllComponents();
  //   this.summary = await this.chatService.sendMessage(chatMessages);
  //   this.localStorageService.setItem(this.getSummaryKey(), this.summary);
  //   const summaryTime = new Date().getTime();
  //   this.localStorageService.setItem(this.getSummaryTimeKey(), summaryTime);
  //   this.summaryDate = new Date(summaryTime);
  //   this.generatingSummary = false;
  //   this.newSummaryAvailable = false;
  // }

  protected getChatMessages(): ChatMessage[] {
    const chatMessages: ChatMessage[] = [];
    const nodes = this.projectService.getNodesInOrder();
    nodes
      .filter((node) => this.projectService.getNodeById(node.id).type === 'node')
      .forEach((node) => {
        node.components.forEach((component) => {
          this.componentId = component.id;
          const prompt = this.projectService.getComponent(node.id, component.id).prompt;
          chatMessages.push(new ChatMessage('system', this.getSystemPrompt(prompt), node.id));
          chatMessages.push(new ChatMessage('user', this.getStudentResponses(), node.id));
        });
      });
    return chatMessages;
  }

  protected getSummaryKey(): string {
    return `unit-summary-${this.periodId}`;
  }

  protected getSummaryTimeKey(): string {
    return `unit-summary-time-${this.periodId}`;
  }
}
