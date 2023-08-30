import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { WiseAuthoringTinymceEditorComponent } from './wise-authoring-tinymce-editor.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let component: WiseAuthoringTinymceEditorComponent;
let fixture: ComponentFixture<WiseAuthoringTinymceEditorComponent>;

describe('WiseAuthoringTinymceEditorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WiseAuthoringTinymceEditorComponent],
      imports: [HttpClientTestingModule, MatDialogModule, StudentTeacherCommonServicesModule],
      providers: [ProjectAssetService, TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
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
