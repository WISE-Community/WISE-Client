import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentStudent } from '../../component-student.component';
import { ConfigService } from '../../../services/configService';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentService } from '../../componentService';
import { MatDialog } from '@angular/material/dialog';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { AiChatMessage } from '../AiChatMessage';
import { AiChatService } from '../aiChatService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AiChatComponent } from '../AiChatComponent';
import { ComputerAvatar } from '../../../common/computer-avatar/ComputerAvatar';
import { applyMixins } from '../../../common/apply-mixins';
import { ComputerAvatarInitializer } from '../../../common/computer-avatar/computer-avatar-initializer';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { StudentStatusService } from '../../../services/studentStatusService';
import { ComputerAvatarSelectorComponent } from '../../../vle/computer-avatar-selector/computer-avatar-selector.component';
import { MatCard } from '@angular/material/card';
import { ComponentHeaderComponent } from '../../../directives/component-header/component-header.component';
import { ChatInputComponent } from '../../../common/chat-input/chat-input.component';
import { AiChatMessagesComponent } from '../ai-chat-messages/ai-chat-messages.component';
import { CRaterService } from '../../../services/cRaterService';
import { firstValueFrom } from 'rxjs';

@Component({
  imports: [
    AiChatMessagesComponent,
    ChatInputComponent,
    ComponentHeaderComponent,
    ComputerAvatarSelectorComponent,
    MatCard
  ],
  styleUrl: './ai-chat-student.component.scss',
  templateUrl: './ai-chat-student.component.html'
})
export class AiChatStudentComponent extends ComponentStudent {
  component: AiChatComponent;
  protected computerAvatar: ComputerAvatar;
  protected computerAvatarSelectorVisible: boolean = false;
  private connectedComponentResponse: string;
  protected messages: AiChatMessage[] = [];
  @ViewChild('messagesContainer') private messagesContainer: ElementRef;
  protected studentResponse: string = '';
  protected submitEnabled: boolean = false;
  protected waitingForComputerResponse: boolean = false;

  constructor(
    private aiChatService: AiChatService,
    protected annotationService: AnnotationService,
    protected computerAvatarService: ComputerAvatarService,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected cRaterService: CRaterService,
    protected dataService: StudentDataService,
    protected dialog: MatDialog,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    private snackBar: MatSnackBar,
    protected studentAssetService: StudentAssetService,
    protected studentStatusService: StudentStatusService
  ) {
    super(
      annotationService,
      componentService,
      configService,
      dialog,
      nodeService,
      notebookService,
      studentAssetService,
      dataService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initializeComputerAvatar();
    if (this.componentState != null) {
      this.messages = this.componentState.studentData.messages;
    }
    this.initializeMessages();
  }

  showInitialMessage(): void {
    this.messages.push(
      new AiChatMessage('assistant', this.component.getComputerAvatarInitialResponse())
    );
  }

  private initializeMessages(): void {
    if (this.messages.length === 0) {
      this.messages.push(new AiChatMessage('system', this.componentContent.systemPrompt));
    }
  }

  protected async submitStudentResponse(response: string): Promise<void> {
    this.waitingForComputerResponse = true;
    if (this.connectedComponentResponse != null) {
      this.messages.push(new AiChatMessage('user', this.connectedComponentResponse, true));
      this.connectedComponentResponse = null;
    }
    const cRaterResponse = await firstValueFrom(
      this.cRaterService.makeCRaterScoringRequest(
        'berkeley_CarOnAColdDay',
        new Date().getTime(),
        response
      )
    );
    const cRaterResult = this.cRaterService.getCRaterResponse(
      cRaterResponse.responses,
      this.submitCounter
    );
    const detectedIdeas = cRaterResult.getDetectedIdeaNames();
    const kiScore = cRaterResult.getKIScore();
    this.messages.push(new AiChatMessage('user', response, false, 'student'));
    this.messages.push(
      new AiChatMessage(
        'user',
        `Detected Ideas: ${detectedIdeas.join(', ')}. KI Score: ${kiScore}`,
        true,
        'nlp'
      )
    );
    this.scrollToBottom();
    try {
      const response = await this.aiChatService.sendChatMessage(
        this.messages,
        this.componentContent.model
      );
      this.waitingForComputerResponse = false;
      this.messages.push(new AiChatMessage('assistant', response.choices[0].message.content));
      this.scrollToBottom();
      this.emitComponentSubmitTriggered();
    } catch (error) {
      this.waitingForComputerResponse = false;
      this.snackBar.open($localize`An error occurred.`);
    }
  }

  createComponentState(action: any): any {
    const componentState: any = this.createNewComponentState();
    componentState.studentData = {
      messages: this.messages,
      model: this.componentContent.model
    };
    if (this.computerAvatar != null) {
      componentState.studentData.computerAvatarId = this.computerAvatar.id;
    }
    componentState.componentType = 'AiChat';
    componentState.nodeId = this.nodeId;
    componentState.componentId = this.component.id;
    const promise = new Promise((resolve, reject) => {
      return this.createComponentStateAdditionalProcessing(
        { resolve: resolve, reject: reject },
        componentState,
        action
      );
    });
    return promise;
  }

  processConnectedComponentState(componentState: any): void {
    this.connectedComponentResponse = componentState.studentData.response;
  }

  initializeComputerAvatar: () => void;

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scroll({
        top: this.messagesContainer.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }
}

applyMixins(AiChatStudentComponent, [ComputerAvatarInitializer]);
