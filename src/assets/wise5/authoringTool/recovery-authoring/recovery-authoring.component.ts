import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notificationService';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { NodeRecoveryAnalysis } from '../../../../app/domain/nodeRecoveryAnalysis';
import { isValidJSONString } from '../../common/string/string';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'recovery-authoring',
  templateUrl: './recovery-authoring.component.html',
  styleUrls: ['./recovery-authoring.component.scss']
})
export class RecoveryAuthoringComponent implements OnInit {
  badNodes: NodeRecoveryAnalysis[] = [];
  protected globalMessage: any;
  jsonValid: boolean;
  projectJSONString: string;
  saveButtonEnabled: boolean = false;
  private subscriptions: Subscription = new Subscription();
  protected unitId: string;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.unitId = this.route.snapshot.paramMap.get('unitId');
    this.projectJSONString = JSON.stringify(this.projectService.project, null, 4);
    this.checkProjectJSONValidity();
    this.subscribeToGlobalMessage();
    this.checkNodes();
  }

  ngDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  projectJSONChanged(): void {
    this.checkProjectJSONValidity();
    this.saveButtonEnabled = this.jsonValid;
    if (this.jsonValid) {
      this.checkNodes();
    }
  }

  private checkProjectJSONValidity(): void {
    this.jsonValid = isValidJSONString(this.projectJSONString);
  }

  private subscribeToGlobalMessage(): void {
    this.subscriptions.add(
      this.notificationService.setGlobalMessage$.subscribe(({ globalMessage }) => {
        this.globalMessage = globalMessage;
      })
    );
  }

  private checkNodes(): void {
    const project = JSON.parse(this.projectJSONString);
    const nodeIdsFound = project.nodes.map((node: any) => {
      return node.id;
    });
    this.badNodes = [];
    for (const node of project.nodes) {
      const nodeRecoveryAnalysis = this.getNodeRecoveryAnalysis(node, nodeIdsFound);
      if (nodeRecoveryAnalysis.hasProblem()) {
        this.badNodes.push(nodeRecoveryAnalysis);
      }
    }
  }

  private getNodeRecoveryAnalysis(node: any, nodeIdsFound: string[]): NodeRecoveryAnalysis {
    const nodeRecoveryAnalysis = new NodeRecoveryAnalysis(node.id);
    if (node.ids != null) {
      this.analyzeGroupChildIds(node, nodeIdsFound, nodeRecoveryAnalysis);
    }
    nodeRecoveryAnalysis.setHasTransitionToNull(this.hasTransitionToNull(node));
    return nodeRecoveryAnalysis;
  }

  private analyzeGroupChildIds(
    node: any,
    nodeIdsFound: string[],
    nodeRecoveryAnalysis: NodeRecoveryAnalysis
  ): void {
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

  private hasTransitionToNull(node: any): boolean {
    return node.transitionLogic?.transitions.some((transition: any) => {
      return transition.to == null;
    });
  }

  save(): void {
    this.projectService.project = JSON.parse(this.projectJSONString);
    this.projectService.saveProject();
    this.saveButtonEnabled = false;
  }
}
