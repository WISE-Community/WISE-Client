import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { NotebookService } from '../../services/notebookService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentAssetService } from '../../services/studentAssetService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { UtilService } from '../../services/utilService';
import { WiseLinkComponent } from './wise-link.component';

describe('WiseLinkComponent', () => {
  let component: WiseLinkComponent;
  let fixture: ComponentFixture<WiseLinkComponent>;
  const nodeId1 = 'node1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, UpgradeModule],
      declarations: [WiseLinkComponent],
      providers: [
        AnnotationService,
        ConfigService,
        NotebookService,
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
    fixture = TestBed.createComponent(WiseLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should go to step', () => {
    const closeAllSpy = spyOn(TestBed.inject(MatDialog), 'closeAll');
    const closeNotesSpy = spyOn(TestBed.inject(NotebookService), 'closeNotes');
    const setCurrentNodeByNodeIdSpy = spyOn(
      TestBed.inject(StudentDataService),
      'setCurrentNodeByNodeId'
    );
    component.nodeId = nodeId1;
    component.goToStep();
    expect(closeAllSpy).toHaveBeenCalled();
    expect(closeNotesSpy).toHaveBeenCalled();
    expect(setCurrentNodeByNodeIdSpy).toHaveBeenCalledWith(nodeId1);
  });
});
