import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../../assets/wise5/services/projectService';

@Component({
  selector: 'show-node-info-dialog',
  templateUrl: './show-node-info-dialog.component.html',
  styleUrls: ['./show-node-info-dialog.component.scss']
})
export class ShowNodeInfoDialogComponent implements OnInit {
  @ViewChild('nodeInfoDiv') nodeInfoDiv: ElementRef;
  stepNumberAndTitle: string;

  constructor(
    public dialogRef: MatDialogRef<ShowNodeInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public nodeId: string,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.stepNumberAndTitle = this.projectService.getNodePositionAndTitle(this.nodeId);
  }

  protected openInNewWindow(): void {
    const newWindow = window.open('', '_blank');
    newWindow.document.write(this.generateHtmlForNewWindow());
  }

  private generateHtmlForNewWindow(): string {
    return `<link rel="stylesheet" href="/wise5/themes/default/style/monitor.css">
        <link rel="stylesheet" href="/wise5/themes/default/style/angular-material.css">
        <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic%7CMaterial+Icons" media="all">
        <body class="layout-column">
          <div class="layout-column">
            <h1 style="background: #1565c0; color: #ffffff; margin: 0px; padding: 10px;">
              ${this.stepNumberAndTitle}
            </h1>
            <div class="md-padding">${this.nodeInfoDiv.nativeElement.innerHTML}</div>
          </div>
        </body>`;
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
