import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AbstractComponentAuthoring } from '../../../authoringTool/components/AbstractComponentAuthoring';
import { TranslatableAssetChooserComponent } from '../../../authoringTool/components/translatable-asset-chooser/translatable-asset-chooser.component';
import { TranslatableInputComponent } from '../../../authoringTool/components/translatable-input/translatable-input.component';
import { ConfigService } from '../../../services/configService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConceptMapService } from '../conceptMapService';

@Component({
  selector: 'concept-map-authoring',
  templateUrl: 'concept-map-authoring.component.html',
  styleUrl: 'concept-map-authoring.component.scss',
  imports: [
    EditComponentPrompt,
    TranslatableInputComponent,
    TranslatableAssetChooserComponent,
    MatCheckbox,
    FormsModule,
    MatFormFieldModule,
    MatInput,
    MatButton,
    MatTooltip,
    MatIcon
  ]
})
export class ConceptMapAuthoring extends AbstractComponentAuthoring {
  availableNodes: any[];
  availableLinks: any[];

  constructor(
    private conceptMapService: ConceptMapService,
    protected configService: ConfigService,
    protected nodeService: TeacherNodeService,
    protected projectAssetService: ProjectAssetService,
    protected projectService: TeacherProjectService
  ) {
    super(configService, nodeService, projectAssetService, projectService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.availableNodes = this.componentContent.nodes;
    this.availableLinks = this.componentContent.links;
    if (this.componentContent.showNodeLabels == null) {
      this.componentContent.showNodeLabels = true;
      this.componentContent.showNodeLabels = true;
    }
  }

  nodeDeleteButtonClicked(index: number): void {
    const nodes = this.componentContent.nodes;
    const node = nodes[index];
    const nodeFileName = node.fileName;
    const nodeLabel = node.label;
    if (
      confirm(
        $localize`Are you sure you want to delete this node?\n\nFile Name: ${nodeFileName}\nLabel: ${nodeLabel}`
      )
    ) {
      nodes.splice(index, 1);
      this.componentChanged();
    }
  }

  linkDeleteButtonClicked(index: number): void {
    const links = this.componentContent.links;
    const link = links[index];
    const linkLabel = link.label;
    if (confirm($localize`Are you sure you want to delete this link?\n\nLabel: ${linkLabel}`)) {
      links.splice(index, 1);
      this.componentChanged();
    }
  }

  addNode(): void {
    const newNode = {
      id: this.getNewConceptMapNodeId(),
      label: '',
      fileName: '',
      width: 100,
      height: 100
    };
    this.componentContent.nodes.push(newNode);
    this.componentChanged();
  }

  getNodeById(nodeId: number): any {
    for (const node of this.componentContent.nodes) {
      if (nodeId === node.id) {
        return node;
      }
    }
    return null;
  }

  addLink(): void {
    const newLink = {
      id: this.getNewConceptMapLinkId(),
      label: '',
      color: ''
    };
    this.componentContent.links.push(newLink);
    this.componentChanged();
  }

  getNewConceptMapNodeId(): string {
    return this.conceptMapService.getNextAvailableId(this.componentContent.nodes, 'node');
  }

  getNewConceptMapLinkId(): string {
    return this.conceptMapService.getNextAvailableId(this.componentContent.links, 'link');
  }

  saveStarterState(starterState: any): void {
    this.componentContent.starterConceptMap = starterState;
    this.componentChanged();
  }

  deleteStarterState(): void {
    this.componentContent.starterConceptMap = null;
    this.componentChanged();
  }
}
