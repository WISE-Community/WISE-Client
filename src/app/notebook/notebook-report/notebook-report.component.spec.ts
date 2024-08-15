import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NotebookReportComponent } from './notebook-report.component';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: NotebookReportComponent;

describe('NotebookReportComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [NotebookReportComponent],
    imports: [MatDialogModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
