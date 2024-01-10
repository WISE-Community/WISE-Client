import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotebookService } from '../../services/notebookService';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';

@Component({
  selector: 'wise-link',
  templateUrl: './wise-link.component.html',
  styleUrls: ['./wise-link.component.scss']
})
export class WiseLinkComponent implements OnInit {
  @Input() linkClass: string;
  @Input() linkText: string;
  @Input() nodeId: string;
  @Input() type: string;

  constructor(
    private dialog: MatDialog,
    private notebookService: NotebookService,
    private projectService: ProjectService,
    private studentDataService: StudentDataService
  ) {}

  ngOnInit(): void {
    if (this.type === null || this.type === '') {
      this.type = 'link';
    }
    if (this.linkText == null || this.linkText === '') {
      this.linkText = this.projectService.getNodePositionAndTitle(this.nodeId);
    }
  }

  goToStep(): void {
    this.dialog.closeAll();
    this.notebookService.closeNotes();
    this.studentDataService.setCurrentNodeByNodeId(this.nodeId);
  }
}
