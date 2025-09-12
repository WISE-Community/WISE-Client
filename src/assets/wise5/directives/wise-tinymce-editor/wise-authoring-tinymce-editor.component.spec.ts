import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { WiseAuthoringTinymceEditorComponent } from './wise-authoring-tinymce-editor.component';
import { MockProviders } from 'ng-mocks';
import { ConfigService } from '../../services/configService';
import { NotebookService } from '../../services/notebookService';

let component: WiseAuthoringTinymceEditorComponent;
let fixture: ComponentFixture<WiseAuthoringTinymceEditorComponent>;

describe('WiseAuthoringTinymceEditorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WiseAuthoringTinymceEditorComponent],
      providers: [MockProviders(ConfigService, NotebookService), MatDialogModule]
    }).compileComponents();
    fixture = TestBed.createComponent(WiseAuthoringTinymceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  getAllowedFileTypeFromMeta();
});

function getAllowedFileTypeFromMeta() {
  it('should get allowed file types from meta when the filetype is image', () => {
    expectAllowedFileTypeToEqual('image', ['image']);
  });
  it('should get allowed file types from meta when the filetype is media', () => {
    expectAllowedFileTypeToEqual('media', ['audio', 'video']);
  });
  it('should get allowed file types from meta when filetype is not specified', () => {
    expectAllowedFileTypeToEqual(null, ['any']);
  });
}

function expectAllowedFileTypeToEqual(metaFileType: string, allowedFileTypes: string[]) {
  const meta = { filetype: metaFileType };
  expect(component.getAllowedFileTypesFromMeta(meta)).toEqual(allowedFileTypes);
}
