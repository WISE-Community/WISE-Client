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

@Injectable()
export class StudentWebSocketService {
  constructor(
    private AnnotationService: AnnotationService,
    private NodeService: NodeService,
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
    this.stompService.periodMessage$
      .subscribe((message: Message) => {
        const body = JSON.parse(message.body);
        if (body.type === 'studentWork') {
          const studentWork = JSON.parse(body.content);
          this.StudentDataService.broadcastStudentWorkReceived(studentWork);
        } else if (body.type === 'annotation') {
          const annotation = JSON.parse(body.content);
          this.AnnotationService.broadcastAnnotationReceived({ annotation: annotation });
        } else if (body.type === 'goToNode') {
          this.goToStep(body.content);
        } else if (body.type === 'node') {
          this.updateNode(body.content);
        }
      });
  }

  subscribeToWorkgroupTopic(): void {
    this.stompService.workgroupMessage$
      .subscribe((message: Message) => {
        const body = JSON.parse(message.body);
        if (body.type === 'annotation') {
          const annotationData = JSON.parse(body.content);
          this.AnnotationService.addOrUpdateAnnotation(annotationData);
          this.handleAnnotationReceived(annotationData);
        } else if (body.type === 'tagsToWorkgroup') {
          const tags = JSON.parse(body.content);
          this.TagService.setTags(tags);
          this.StudentDataService.updateNodeStatuses();
          this.NodeService.evaluateTransitionLogic();
        } else if (body.type === 'goToNode') {
          this.goToStep(body.content);
        } else if (body.type === 'goToNextNode') {
          this.goToNextStep();
        } else if (body.type === 'classmateStudentWork') {
          this.StudentDataService.broadcastStudentWorkReceived(JSON.parse(body.content));
        }
      });
  }

  handleAnnotationReceived(annotation: any): void {
    this.StudentDataService.studentData.annotations.push(annotation);
    if (annotation.notebookItemId) {
      this.notebookService.broadcastNotebookItemAnnotationReceived({ annotation: annotation });
    } else {
      this.AnnotationService.broadcastAnnotationReceived({ annotation: annotation });
    }
  }

  goToStep(nodeId: string): void {
    this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(nodeId);
  }

  goToNextStep(): void {
    this.NodeService.getNextNodeId().then((nextNodeId) => {
      this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(nextNodeId);
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
