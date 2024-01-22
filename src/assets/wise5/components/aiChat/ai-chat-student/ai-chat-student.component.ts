import { Component } from '@angular/core';
import { ComponentStudent } from '../../component-student.component';
import { ConfigService } from '../../../services/configService';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentService } from '../../componentService';
import { MatDialog } from '@angular/material/dialog';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { AiChatMessage } from '../aiChatMessage';
import { AiChatService } from '../aiChatService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AiChatComponent } from '../AiChatComponent';
import { ComputerAvatarService } from '../../../services/computerAvatarService';
import { ComputerAvatar } from '../../../common/ComputerAvatar';
import { StudentStatusService } from '../../../services/studentStatusService';

@Component({
  selector: 'ai-chat-student',
  templateUrl: './ai-chat-student.component.html',
  styleUrls: ['./ai-chat-student.component.scss']
})
export class AiChatStudentComponent extends ComponentStudent {
  component: AiChatComponent;
  computerAvatar: ComputerAvatar;
  protected messages: AiChatMessage[] = [];
  protected computerAvatarSelectorVisible: boolean = false;
  protected studentResponse: string = '';
  protected submitEnabled: boolean = false;
  protected waitingForComputerResponse: boolean = false;
  workgroupId: number;

  constructor(
    private aiChatService: AiChatService,
    protected annotationService: AnnotationService,
    protected componentService: ComponentService,
    protected computerAvatarService: ComputerAvatarService,
    protected configService: ConfigService,
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
    if (this.component.isComputerAvatarEnabled()) {
      this.initializeComputerAvatar();
    } else {
      this.computerAvatar = this.computerAvatarService.getDefaultAvatar();
    }
    if (this.componentState != null) {
      this.messages = this.componentState.studentData.messages;
    }
    this.workgroupId = this.configService.getWorkgroupId();
    this.initializeMessages();
  }

  initializeComputerAvatar(): void {
    this.tryToRepopulateComputerAvatar();
    if (this.hasStudentPreviouslyChosenComputerAvatar()) {
      this.hideComputerAvatarSelector();
    } else if (
      this.component.isOnlyOneComputerAvatarAvailable() &&
      !this.component.isComputerAvatarPromptAvailable()
    ) {
      this.hideComputerAvatarSelector();
      this.selectComputerAvatar(this.getTheOnlyComputerAvatarAvailable());
    } else {
      this.showComputerAvatarSelector();
    }
  }

  private tryToRepopulateComputerAvatar(): void {
    if (this.includesComputerAvatar(this.componentState)) {
      this.repopulateComputerAvatarFromComponentState(this.componentState);
    } else if (
      this.component.isUseGlobalComputerAvatar() &&
      this.isGlobalComputerAvatarAvailable()
    ) {
      this.repopulateGlobalComputerAvatar();
    }
  }

  private includesComputerAvatar(componentState: any): boolean {
    return componentState?.studentData?.computerAvatarId != null;
  }

  private isGlobalComputerAvatarAvailable(): boolean {
    return this.studentStatusService.getComputerAvatarId() != null;
  }

  private repopulateComputerAvatarFromComponentState(componentState: any): void {
    this.computerAvatar = this.computerAvatarService.getAvatar(
      componentState?.studentData?.computerAvatarId
    );
  }

  private repopulateGlobalComputerAvatar(): void {
    const computerAvatarId = this.studentStatusService.getComputerAvatarId();
    if (computerAvatarId != null) {
      this.selectComputerAvatar(this.computerAvatarService.getAvatar(computerAvatarId));
    }
  }

  private hasStudentPreviouslyChosenComputerAvatar(): boolean {
    return this.computerAvatar != null;
  }

  private getTheOnlyComputerAvatarAvailable(): ComputerAvatar {
    return this.computerAvatarService.getAvatar(
      this.component.content.computerAvatarSettings.ids[0]
    );
  }

  private showComputerAvatarSelector(): void {
    this.computerAvatarSelectorVisible = true;
  }

  private hideComputerAvatarSelector(): void {
    this.computerAvatarSelectorVisible = false;
  }

  selectComputerAvatar(computerAvatar: ComputerAvatar): void {
    this.computerAvatar = computerAvatar;
    if (this.component.isUseGlobalComputerAvatar()) {
      this.studentStatusService.setComputerAvatarId(computerAvatar.id);
    }
    this.hideComputerAvatarSelector();
    const computerAvatarInitialResponse = this.component.getComputerAvatarInitialResponse();
    if (computerAvatarInitialResponse != null && computerAvatarInitialResponse !== '') {
      this.appendMessage(
        this.createAssistantMessage(this.componentContent.computerAvatarSettings.initialResponse)
      );
    }
  }

  private initializeMessages(): void {
    if (this.messages.length === 0) {
      this.appendMessage(this.createSystemMessage(this.componentContent.systemPrompt));
    }
  }

  protected async submitStudentResponse(): Promise<void> {
    this.waitingForComputerResponse = true;
    this.appendMessage(this.createUserMessage(this.studentResponse));
    this.clearStudentResponse();
    try {
      const response = await this.aiChatService.sendChatMessage(
        this.messages,
        this.componentContent.model
      );
      this.waitingForComputerResponse = false;
      this.appendMessage(this.createAssistantMessage(this.extractResponseMessageContent(response)));
      this.emitComponentSubmitTriggered();
    } catch (error) {
      this.waitingForComputerResponse = false;
      this.snackBar.open($localize`An error occurred.`);
    }
  }

  private appendMessage(messageObject: any): void {
    this.messages.push(messageObject);
  }

  private clearStudentResponse(): void {
    this.studentResponse = '';
  }

  private extractResponseMessageContent(response: any): string {
    return response.choices[0].message.content;
  }

  private createSystemMessage(message: string): AiChatMessage {
    return {
      role: 'system',
      content: message
    };
  }

  private createUserMessage(message: string): AiChatMessage {
    return {
      role: 'user',
      content: message
    };
  }

  private createAssistantMessage(message: string): AiChatMessage {
    return {
      role: 'assistant',
      content: message
    };
  }

  protected keyPressed(event: any): void {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (this.submitEnabled && !this.waitingForComputerResponse) {
        this.submitStudentResponse();
      }
    }
  }

  studentResponseChanged(): void {
    this.submitEnabled = this.studentResponse.length > 0;
    this.setIsSubmitDirty(this.isSubmitDirty || this.submitEnabled);
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
}
