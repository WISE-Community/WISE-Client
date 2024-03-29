import { Component } from '@angular/core';
import { ConfigService } from '../../services/configService';
import { WiseTinymceEditorComponent } from './wise-tinymce-editor.component';
import { NotebookService } from '../../services/notebookService';
import 'tinymce';
import { MatDialog } from '@angular/material/dialog';
import { ProjectAssetAuthoringComponent } from '../../authoringTool/project-asset-authoring/project-asset-authoring.component';
import { WiseLinkAuthoringDialogComponent } from '../../authoringTool/wise-link-authoring-dialog/wise-link-authoring-dialog.component';
import { filter } from 'rxjs';

declare let tinymce: any;

@Component({
  selector: 'wise-authoring-tinymce-editor',
  styleUrls: ['wise-authoring-tinymce-editor.component.scss'],
  templateUrl: 'wise-tinymce-editor.component.html'
})
export class WiseAuthoringTinymceEditorComponent extends WiseTinymceEditorComponent {
  protected toolbar: string = `undo redo | fontselect | formatselect | fontsizeselect |
    bold italic underline | image media link wiselink | forecolor backcolor | alignment numlist bullist |
    emoticons removeformat fullscreen`;
  protected toolbarGroups: any = {
    alignment: {
      icon: 'align-left',
      tooltip: $localize`Alignment`,
      items: 'alignleft aligncenter alignright | outdent indent'
    }
  };

  constructor(
    private ConfigService: ConfigService,
    private dialog: MatDialog,
    NotebookService: NotebookService
  ) {
    super(NotebookService);
  }

  ngOnInit(): void {
    this.addPluginName('wiselink');
    this.initializeInsertWISELinkPlugin();
    this.initializeTinyMCE();
  }

  private initializeInsertWISELinkPlugin(): void {
    const thisComponent = this;
    tinymce.PluginManager.add('wiselink', function (editor: any, url: string) {
      editor.ui.registry.addIcon(
        'wiselink',
        '<svg xmlns="http://www.w3.org/2000/svg" ' +
          'height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/>' +
          '<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 ' +
          '5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 ' +
          '3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>'
      );
      editor.ui.registry.addButton('wiselink', {
        tooltip: $localize`Insert WISE Link`,
        icon: 'wiselink',
        onAction: function () {
          thisComponent
            .openWISELinkChooser()
            .afterClosed()
            .pipe(filter((result: any) => result != null))
            .subscribe((result: any) => {
              let content = '';
              if (result.wiseLinkType === 'link') {
                content =
                  `<a href="#" wiselink="true" node-id="${result.wiseLinkNodeId}" ` +
                  `component-id="${result.wiseLinkComponentId}" ` +
                  `link-text="${result.wiseLinkText}">${result.wiseLinkText}</a>`;
              } else if (result.wiseLinkType === 'button') {
                content =
                  `<button wiselink="true" node-id="${result.wiseLinkNodeId}" ` +
                  `component-id="${result.wiseLinkComponentId}" ` +
                  `link-text="${result.wiseLinkText}">${result.wiseLinkText}</button>`;
              }
              editor.insertContent(content);
            });
        }
      });
    });
  }

  private openWISELinkChooser(): any {
    return this.dialog.open(WiseLinkAuthoringDialogComponent, {
      width: '80%'
    });
  }

  filePicker(callback: any, value: any, meta: any) {
    this.dialog
      .open(ProjectAssetAuthoringComponent, {
        data: {
          isPopup: true,
          allowedFileTypes: this.getAllowedFileTypesFromMeta(meta)
        },
        width: '80%'
      })
      .afterClosed()
      .subscribe((result: any) => {
        const fileName = result.assetItem.fileName;
        const fileNameNoExt = fileName.substr(0, fileName.lastIndexOf('.')) || fileName;
        const fullFilePath = `${this.ConfigService.getProjectAssetsDirectoryPath()}/${fileName}`;
        callback(fullFilePath, { alt: fileNameNoExt, text: fileNameNoExt });
      });
  }

  getAllowedFileTypesFromMeta(meta: any): string[] {
    const allowedFileTypes: string[] = [];
    if (meta.filetype === 'media') {
      allowedFileTypes.push('audio');
      allowedFileTypes.push('video');
    } else if (meta.filetype === 'image') {
      allowedFileTypes.push('image');
    } else {
      allowedFileTypes.push('any');
    }
    return allowedFileTypes;
  }
}
