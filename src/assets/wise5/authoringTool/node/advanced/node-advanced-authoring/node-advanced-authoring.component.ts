import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterModule],
  styleUrl: './node-advanced-authoring.component.scss',
  templateUrl: './node-advanced-authoring.component.html'
})
export class NodeAdvancedAuthoringComponent implements OnInit {
  protected isGroupNode: boolean;

  constructor(
    private projectService: TeacherProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.parent.parent.params.subscribe(
      (params) => (this.isGroupNode = this.projectService.getNode(params.nodeId).isGroup())
    );
  }
}
