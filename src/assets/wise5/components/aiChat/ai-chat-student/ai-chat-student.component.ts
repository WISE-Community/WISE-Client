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
import { AiChatMessage } from '../AiChatMessage';
import { AiChatService } from '../aiChatService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AiChatComponent } from '../AiChatComponent';

@Component({
  selector: 'ai-chat-student',
  templateUrl: './ai-chat-student.component.html',
  styleUrls: ['./ai-chat-student.component.scss']
})
export class AiChatStudentComponent extends ComponentStudent {
  component: AiChatComponent;
  protected messages: AiChatMessage[] = [];
  protected studentResponse: string = '';
  protected submitEnabled: boolean = false;
  protected waitingForComputerResponse: boolean = false;

  constructor(
    private aiChatService: AiChatService,
    protected annotationService: AnnotationService,
    protected componentService: ComponentService,
    protected configService: ConfigService,
    protected dataService: StudentDataService,
    protected dialog: MatDialog,
    protected nodeService: NodeService,
    protected notebookService: NotebookService,
    private snackBar: MatSnackBar,
    protected studentAssetService: StudentAssetService
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
    if (this.componentState != null) {
      this.messages = this.componentState.studentData.messages;
    }
    this.initializeMessages();
  }

  private initializeMessages(): void {
    if (this.messages.length === 0) {
      this.messages.push(new AiChatMessage('system', this.componentContent.systemPrompt));
    }
  }

  protected async submitStudentResponse(): Promise<void> {
    this.waitingForComputerResponse = true;
    this.messages.push(new AiChatMessage('user', this.studentResponse));
    this.clearStudentResponse();
    try {
      const response = await this.aiChatService.sendChatMessage(
        this.messages,
        this.componentContent.model
      );
      this.waitingForComputerResponse = false;
      this.messages.push(new AiChatMessage('assistant', response.choices[0].message.content));
      this.emitComponentSubmitTriggered();
    } catch (error) {
      this.waitingForComputerResponse = false;
      this.snackBar.open($localize`An error occurred.`);
    }
  }

  private clearStudentResponse(): void {
    this.studentResponse = '';
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
