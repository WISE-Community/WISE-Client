import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Node } from '../Node';

interface KIIcon {
  imgAlt: string;
  imgLabel: string;
  imgSrc: string;
}

@Component({
  selector: 'node-icon-chooser-dialog',
  styleUrls: ['node-icon-chooser-dialog.component.scss'],
  templateUrl: 'node-icon-chooser-dialog.component.html'
})
export class NodeIconChooserDialog {
  colors = [
    '#66BB6A',
    '#009688',
    '#00B0FF',
    '#1565C0',
    '#673AB7',
    '#AB47BC',
    '#E91E63',
    '#D50000',
    '#F57C00',
    '#FBC02D',
    '#795548',
    '#757575'
  ];

  fontNames = [
    'access_time',
    'alarm',
    'announcement',
    'article',
    'assignment',
    'assignment_turned_in',
    'bolt',
    'book',
    'bookmark',
    'build',
    'chrome_reader_mode',
    'compare',
    'create',
    'dashboard',
    'description',
    'developer_board',
    'domain',
    'explore',
    'extension',
    'fact_check',
    'favorite',
    'flash_on',
    'help',
    'image',
    'info',
    'insert_chart',
    'gamepad',
    'lightbulb',
    'live_tv',
    'message',
    'movie',
    'note_add',
    'pageview',
    'palette',
    'photo_camera',
    'place',
    'question_answer',
    'search',
    'school',
    'slideshow',
    'star',
    'thumbs_up_down',
    'trending_up',
    'verified',
    'verified_user',
    'view_list'
  ];
  kiIcons: KIIcon[] = [
    {
      imgAlt: $localize`Knowledge Integration elicit ideas`,
      imgLabel: $localize`Elicit Ideas`,
      imgSrc: 'assets/img/icons/ki-color-elicit.svg'
    },
    {
      imgAlt: $localize`Knowledge Integration discover ideas`,
      imgLabel: $localize`Discover Ideas`,
      imgSrc: 'assets/img/icons/ki-color-add.svg'
    },
    {
      imgAlt: $localize`Knowledge Integration distinguish ideas`,
      imgLabel: $localize`Distinguish Ideas`,
      imgSrc: 'assets/img/icons/ki-color-distinguish.svg'
    },
    {
      imgAlt: $localize`Knowledge Integration connect ideas and reflect`,
      imgLabel: $localize`Connect Ideas & Reflect`,
      imgSrc: 'assets/img/icons/ki-color-connect.svg'
    },
    {
      imgAlt: $localize`Knowledge Integration cycle`,
      imgLabel: $localize`KI Cycle`,
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

  chooseFontColor(event: any) {
    if (event.selected) {
      this.setFontType();
      this.newNodeIcon.color = event.source.value;
    }
  }

  chooseFontName(event: any) {
    if (event.selected) {
      this.setFontType();
      this.newNodeIcon.fontName = event.source.value;
    }
  }

  chooseKIIcon(event: any) {
    if (event.selected) {
      this.setImgType();
      Object.assign(this.newNodeIcon, event.source.value);
    }
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
