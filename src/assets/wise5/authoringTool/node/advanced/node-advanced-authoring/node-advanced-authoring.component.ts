import { Component, OnInit } from '@angular/core';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'node-advanced-authoring',
  templateUrl: './node-advanced-authoring.component.html',
  styleUrls: ['./node-advanced-authoring.component.scss']
})
export class NodeAdvancedAuthoringComponent implements OnInit {
  protected isGroupNode: boolean;
  protected nodeId: string;

  constructor(private projectService: TeacherProjectService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent.params.subscribe((params) => {
      this.nodeId = params.nodeId;
      this.isGroupNode = this.projectService.getNode(this.nodeId).isGroup();
    });
  }
}
