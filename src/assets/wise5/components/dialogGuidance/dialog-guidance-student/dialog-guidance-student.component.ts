import { Component } from '@angular/core';
import { AnnotationService } from '../../../services/annotationService';
import { ComponentStudent } from '../../component-student.component';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { UtilService } from '../../../services/utilService';
import { ComponentService } from '../../componentService';
import { DialogResponse } from '../DialogResponse';

@Component({
  selector: 'dialog-guidance-student',
  templateUrl: './dialog-guidance-student.component.html',
  styleUrls: ['./dialog-guidance-student.component.scss']
})
export class DialogGuidanceStudentComponent extends ComponentStudent {
  responses: DialogResponse[] = [
    new DialogResponse('hello', 'Student'),
    new DialogResponse('Computer says hi', 'Computer'),
    new DialogResponse('bye', 'Student'),
    new DialogResponse('Computer says bye', 'Computer')
  ];

  constructor(
    protected AnnotationService: AnnotationService,
    protected ComponentService: ComponentService,
    protected ConfigService: ConfigService,
    protected NodeService: NodeService,
    protected NotebookService: NotebookService,
    protected StudentAssetService: StudentAssetService,
    protected StudentDataService: StudentDataService,
    protected upgrade: UpgradeModule,
    protected UtilService: UtilService
  ) {
    super(
      AnnotationService,
      ComponentService,
      ConfigService,
      NodeService,
      NotebookService,
      StudentAssetService,
      StudentDataService,
      upgrade,
      UtilService
    );
  }

  ngOnInit(): void {}
}
