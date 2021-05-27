import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Node } from '../Node';

interface KIIcon {
  imgAlt: string;
  imgSrc: string;
}

@Component({
  selector: 'node-icon-chooser-dialog',
  styleUrls: ['node-icon-chooser-dialog.component.scss'],
  templateUrl: 'node-icon-chooser-dialog.component.html'
})
export class NodeIconChooserDialog {
  colors = ['#2196F3', '#4CAF50', '#9C27B0', '#F57C00'];
  fontNames = [
    'access_time',
    'assignment',
    'build',
    'chrome_reader_mode',
    'compare',
    'create',
    'developer_board',
    'domain',
    'explore',
    'extension',
    'help',
    'info',
    'insert_chart',
    'gamepad',
    'message',
    'pageview',
    'palette',
    'photo_camera',
    'school',
    'trending_up',
    'view_list'
  ];
  kiIcons: KIIcon[] = [
    {
      imgAlt: $localize`Knowledge Integration elicit ideas`,
      imgSrc: 'assets/img/icons/ki-color-elicit.svg'
    },
    {
      imgAlt: $localize`Knowledge Integration discover ideas`,
      imgSrc: 'assets/img/icons/ki-color-add.svg'
    },
    {
      imgAlt: $localize`Knowledge Integration distinguish ideas`,
      imgSrc: 'assets/img/icons/ki-color-distinguish.svg'
    },
    {
      imgAlt: $localize`Knowledge Integration connect ideas`,
      imgSrc: 'assets/img/icons/ki-color-connect.svg'
    },
    {
      imgAlt: $localize`Knowledge Integration cycle`,
      imgSrc: 'assets/img/icons/ki-color-cycle.svg'
    }
  ];
  newNodeIcon: any;
  node: Node;

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<NodeIconChooserDialog>,
    private ProjectService: TeacherProjectService
  ) {}

  ngOnInit() {
    this.node = this.data.node;
    this.newNodeIcon = Object.assign({}, this.node.getIcon());
  }

  chooseFontColor(color: string) {
    this.setFontType();
    this.newNodeIcon.color = color;
  }

  chooseFontName(name: string) {
    this.setFontType();
    this.newNodeIcon.fontName = name;
  }

  chooseKIIcon(kiIcon: KIIcon) {
    this.setImgType();
    Object.assign(this.newNodeIcon, kiIcon);
  }

  setImgType() {
    this.newNodeIcon.type = 'img';
  }

  setFontType() {
    this.newNodeIcon.type = 'font';
  }

  save() {
    const nodeContent = this.ProjectService.getNodeById(this.node.id);
    nodeContent.icon = Object.assign(this.node.getIcon(), this.newNodeIcon);
    this.ProjectService.saveProject();
    this.dialogRef.close();
  }
}
