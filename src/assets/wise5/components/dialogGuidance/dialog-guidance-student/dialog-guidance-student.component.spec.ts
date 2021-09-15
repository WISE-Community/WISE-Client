import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { CRaterService } from '../../../services/cRaterService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { MockNodeService } from '../../animation/animation-authoring/animation-authoring.component.spec';
import { MockService } from '../../animation/animation-student/animation-student.component.spec';
import { ComponentService } from '../../componentService';
import { DialogGuidanceService } from '../dialogGuidanceService';

import { DialogGuidanceStudentComponent } from './dialog-guidance-student.component';

describe('DialogGuidanceStudentComponent', () => {
  let component: DialogGuidanceStudentComponent;
  let fixture: ComponentFixture<DialogGuidanceStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogGuidanceStudentComponent],
      imports: [HttpClientTestingModule, UpgradeModule],
      providers: [
        AnnotationService,
        ComponentService,
        CRaterService,
        ConfigService,
        DialogGuidanceService,
        { provide: NodeService, useClass: MockNodeService },
        { provide: NotebookService, useClass: MockService },
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGuidanceStudentComponent);
    component = fixture.componentInstance;
    component.componentContent = TestBed.inject(DialogGuidanceService).createComponent();
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
