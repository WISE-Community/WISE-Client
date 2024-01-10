'use strict';

import { Injectable } from '@angular/core';
import { AnnotationService } from './annotationService';
import { TagService } from './tagService';
import { StudentDataService } from './studentDataService';
import { NodeService } from './nodeService';
import { ProjectService } from './projectService';
import { Message } from '@stomp/stompjs';
import { NotebookService } from './notebookService';
import { StompService } from './stompService';
import { ConfigService } from './configService';
import { Annotation } from '../common/Annotation';

@Injectable()
export class StudentWebSocketService {
  constructor(
    private AnnotationService: AnnotationService,
    private configService: ConfigService,
    private nodeService: NodeService,
    private notebookService: NotebookService,
    private ProjectService: ProjectService,
    private stompService: StompService,
    private StudentDataService: StudentDataService,
    private TagService: TagService
  ) {}

  initialize(): void {
    this.subscribeToClassroomTopic();
    this.subscribeToWorkgroupTopic();
  }

  subscribeToClassroomTopic(): void {
    this.stompService.periodMessage$.subscribe((message: Message) => {
      const body = JSON.parse(message.body);
      if (body.type === 'studentWork') {
        const studentWork = JSON.parse(body.content);
        this.StudentDataService.broadcastStudentWorkReceived(studentWork);
      } else if (body.type === 'annotation') {
        this.AnnotationService.broadcastAnnotationReceived(JSON.parse(body.content));
      } else if (body.type === 'goToNode') {
        this.goToStep(body.content);
      } else if (body.type === 'node') {
        this.updateNode(body.content);
      } else if (body.type === 'newWorkgroupJoinedRun') {
        this.configService.retrieveConfig(
          `/api/config/studentRun/${this.configService.getRunId()}`
        );
      }
    });
  }

  subscribeToWorkgroupTopic(): void {
    this.stompService.workgroupMessage$.subscribe((message: Message) => {
      const body = JSON.parse(message.body);
      if (body.type === 'annotation') {
        const annotation = JSON.parse(body.content);
        this.AnnotationService.addOrUpdateAnnotation(annotation);
        this.handleAnnotationReceived(annotation);
      } else if (body.type === 'tagsToWorkgroup') {
        const tags = JSON.parse(body.content);
        this.TagService.setTags(tags);
        this.StudentDataService.updateNodeStatuses();
        this.nodeService.evaluateTransitionLogic();
      } else if (body.type === 'goToNode') {
        this.goToStep(body.content);
      } else if (body.type === 'goToNextNode') {
        this.goToNextStep();
      } else if (body.type === 'classmateStudentWork') {
        this.StudentDataService.broadcastStudentWorkReceived(JSON.parse(body.content));
      }
    });
  }

  private handleAnnotationReceived(annotation: Annotation): void {
    this.StudentDataService.studentData.annotations.push(annotation);
    if (annotation.notebookItemId) {
      this.notebookService.broadcastNotebookItemAnnotationReceived(annotation);
    } else {
      this.AnnotationService.broadcastAnnotationReceived(annotation);
    }
  }

  goToStep(nodeId: string): void {
    this.nodeService.setCurrentNode(nodeId);
  }

  goToNextStep(): void {
    this.nodeService.getNextNodeId().then((nextNodeId) => {
      this.nodeService.setCurrentNode(nextNodeId);
    });
  }

  updateNode(nodeString: string): void {
    const node = JSON.parse(nodeString);
    this.ProjectService.replaceNode(node.id, node);
    this.ProjectService.parseProject();
    this.StudentDataService.updateNodeStatuses();
  }

  sendStudentWorkToClassmate(workgroupId: number, studentWork: any): void {
    this.stompService.rxStomp.publish({
      destination: `/app/api/workgroup/${workgroupId}/student-work`,
      body: JSON.stringify(studentWork)
    });
  }
}
