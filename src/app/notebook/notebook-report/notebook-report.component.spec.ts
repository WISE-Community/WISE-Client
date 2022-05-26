import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../assets/wise5/services/annotationService';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { SessionService } from '../../../assets/wise5/services/sessionService';
import { StudentAssetService } from '../../../assets/wise5/services/studentAssetService';
import { StudentDataService } from '../../../assets/wise5/services/studentDataService';
import { TagService } from '../../../assets/wise5/services/tagService';
import { UtilService } from '../../../assets/wise5/services/utilService';
import { NotebookReportComponent } from './notebook-report.component';

let component: NotebookReportComponent;

describe('NotebookReportComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, UpgradeModule],
      declarations: [NotebookReportComponent],
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
    });
    const fixture = TestBed.createComponent(NotebookReportComponent);
    component = fixture.componentInstance;
    component.config = createConfig();
  });

  isNoteEnabled();
  setSaveTime();
  clearSaveTime();
});

function createConfig() {
  return {
    itemTypes: {
      note: {
        enabled: true
      }
    }
  };
}

function isNoteEnabled() {
  it('should check if note is enabled when it is not enabled', () => {
    component.config.itemTypes.note.enabled = false;
    expect(component.isNoteEnabled()).toEqual(false);
  });
  it('should check if note is enabled when it is enabled', () => {
    component.config.itemTypes.note.enabled = true;
    expect(component.isNoteEnabled()).toEqual(true);
  });
}

function setSaveTime() {
  it('should set the save time', () => {
    expect(component.saveTime).toEqual(null);
    const saveTimestamp = 1607718407613;
    component.setSaveTime(saveTimestamp);
    expect(component.saveTime).toEqual(saveTimestamp);
  });
}

function clearSaveTime() {
  it('should clear the saved time', () => {
    const saveTimestamp = 1607718407613;
    component.saveTime = saveTimestamp;
    component.clearSaveTime();
    expect(component.saveTime).toEqual(null);
  });
}
