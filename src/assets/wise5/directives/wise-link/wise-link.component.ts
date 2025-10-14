import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../services/projectService';
import { StudentDataService } from '../../services/studentDataService';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  imports: [MatButton, MatTooltip],
  selector: 'wise-link',
  templateUrl: './wise-link.component.html'
})
export class WiseLinkComponent implements OnInit {
  @Input() linkClass: string;
  @Input() linkText: string;
  @Input() nodeId: string;
  @Input() type: string;

  constructor(
    private dataService: StudentDataService,
    private dialog: MatDialog,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    if (this.type === null || this.type === '') {
      this.type = 'link';
    }
    if (this.linkText == null || this.linkText === '') {
      this.linkText = this.projectService.getNodePositionAndTitle(this.nodeId);
    }
  }

  protected goToStep(): void {
    this.dialog.closeAll();
    this.dataService.setCurrentNodeByNodeId(this.nodeId);
  }
}
