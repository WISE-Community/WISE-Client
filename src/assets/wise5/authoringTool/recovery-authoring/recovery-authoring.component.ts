import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notificationService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { UtilService } from '../../services/utilService';
import { NodeRecoveryAnalysis } from '../../../../app/domain/nodeRecoveryAnalysis';

@Component({
  selector: 'recovery-authoring',
  templateUrl: './recovery-authoring.component.html',
  styleUrls: ['./recovery-authoring.component.scss']
})
export class RecoveryAuthoringComponent implements OnInit {
  badNodes: NodeRecoveryAnalysis[] = [];
  globalMessage: any;
  projectJSONString: string;
  saveButtonEnabled: boolean = false;
  subscriptions: Subscription = new Subscription();
  jsonIsValid: boolean;

  constructor(
    private notificationService: NotificationService,
    private projectService: TeacherProjectService,
    private utilService: UtilService
  ) {}

  subscribeToGlobalMessage(): void {
    this.subscriptions.add(
      this.notificationService.setGlobalMessage$.subscribe(({ globalMessage }) => {
        this.globalMessage = globalMessage;
      })
    );
  }

  ngOnInit(): void {
    this.projectJSONString = JSON.stringify(this.projectService.project, null, 4);
    this.checkProjectJSONValidity();
    this.subscribeToGlobalMessage();
    this.checkNodes();
  }

  ngDestroy(): void {}

  projectJSONChanged(): void {
    this.checkProjectJSONValidity();
    this.saveButtonEnabled = this.jsonIsValid;
    this.checkNodes();
  }

  checkProjectJSONValidity(): void {
    this.jsonIsValid = this.utilService.isValidJSONString(this.projectJSONString);
  }

  checkNodes(): void {
    const project = JSON.parse(this.projectJSONString);
    const nodeIdsFound = project.nodes.map((node: any) => {
      return node.id;
    });
    this.badNodes = [];
    for (const node of project.nodes) {
      const nodeRecoveryAnalysis = new NodeRecoveryAnalysis(node.id);
      if (node.ids != null) {
        const nodesReferencesInGroup = new Map();
        for (const referencedId of node.ids) {
          if (!nodeIdsFound.includes(referencedId)) {
            nodeRecoveryAnalysis.addReferencedIdThatDoesNotExist(referencedId);
          }
          if (nodesReferencesInGroup.get(referencedId)) {
            nodeRecoveryAnalysis.addReferencedIdThatIsDuplicated(referencedId);
          }
          nodesReferencesInGroup.set(referencedId, true);
        }
      }
      nodeRecoveryAnalysis.setHasTransitionToNull(this.hasNullTransition(node));
      if (nodeRecoveryAnalysis.hasProblem()) {
        this.badNodes.push(nodeRecoveryAnalysis);
      }
    }
  }

  hasNullTransition(node: any): boolean {
    return node.transitionLogic.transitions.some((transition: any) => {
      return transition.to == null;
    });
  }

  save(): void {
    this.projectService.project = JSON.parse(this.projectJSONString);
    this.projectService.saveProject();
    this.saveButtonEnabled = false;
  }
}
