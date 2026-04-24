import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { NodeAdvancedGeneralAuthoringComponent } from '../general/node-advanced-general-authoring.component';
import { MatTabsModule } from '@angular/material/tabs';
import { EditNodeRubricComponent } from '../../editRubric/edit-node-rubric.component';
import { NodeAdvancedConstraintAuthoringComponent } from '../constraint/node-advanced-constraint-authoring.component';
import { NodeAdvancedPathAuthoringComponent } from '../path/node-advanced-path-authoring.component';
import { NodeAdvancedJsonAuthoringComponent } from '../json/node-advanced-json-authoring.component';

@Component({
  imports: [
    EditNodeRubricComponent,
    MatButtonModule,
    MatDialogModule,
    MatDivider,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    NodeAdvancedConstraintAuthoringComponent,
    NodeAdvancedGeneralAuthoringComponent,
    NodeAdvancedJsonAuthoringComponent,
    NodeAdvancedPathAuthoringComponent
  ],
  styleUrl: './node-advanced-authoring.component.scss',
  templateUrl: './node-advanced-authoring.component.html'
})
export class NodeAdvancedAuthoringComponent implements OnInit {
  protected isStepNode: boolean;
  protected node: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public nodeId: string,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    this.node = this.projectService.getNodeById(this.nodeId);
    this.isStepNode = this.node.type === 'node';
  }
}
