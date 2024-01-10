import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { WiseLinkService } from '../../../../../app/services/wiseLinkService';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentStudent } from '../../component-student.component';
import { ComponentService } from '../../componentService';

@Component({
  selector: 'html-student',
  styleUrls: ['html-student.component.scss'],
  templateUrl: 'html-student.component.html'
})
export class HtmlStudent extends ComponentStudent {
  html: SafeHtml = '';

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected dialog: MatDialog,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected UtilService: UtilService,
    private wiseLinkService: WiseLinkService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      dialog,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService,
      UtilService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.html = this.wiseLinkService.generateHtmlWithWiseLink(this.componentContent.html);
    this.broadcastDoneRenderingComponent();
  }
}
