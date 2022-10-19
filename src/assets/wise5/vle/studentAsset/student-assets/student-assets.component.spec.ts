import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentAssetsComponent } from './student-assets.component';
import { ProjectService } from '../../../services/projectService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../../common/ComponentContent';

describe('StudentAssetsComponent', () => {
  let component: StudentAssetsComponent;
  let assetFile1: any;
  let assetFile2: any;
  const fileName1 = 'filename1.jpg';
  const fileName2 = 'filename2.jpg';
  const filePath1 = '/path/to/filename1.jpg';
  const filePath2 = '/path/to/filename2.jpg';
  let fixture: ComponentFixture<StudentAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StudentTeacherCommonServicesModule],
      declarations: [StudentAssetsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentAssetsComponent);
    assetFile1 = createAssetFile(fileName1, filePath1);
    assetFile2 = createAssetFile(fileName2, filePath2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function createAssetFile(fileName: string, filePath: string): any {
    return {
      fileName: fileName,
      filePath: filePath
    };
  }

  it('should upload student assets', fakeAsync(() => {
    const uploadAssetSpy = spyOnUploadAsset();
    const getComponentSpy = spyOnGetComponent('Draw');
    const files = [assetFile1, assetFile2];
    component.uploadStudentAssets(files);
    tick();
    expect(uploadAssetSpy).toHaveBeenCalledTimes(2);
    expect(getComponentSpy).toHaveBeenCalledTimes(2);
  }));

  it('should attach student asset', () => {
    const getComponentSpy = spyOnGetComponent('Draw');
    const broadcastAttachStudentAssetSpy = spyOnBroadcastAttachStudentAsset();
    component.attachStudentAsset(assetFile1);
    expect(getComponentSpy).toHaveBeenCalled();
    expect(broadcastAttachStudentAssetSpy).toHaveBeenCalled();
  });

  it('should not attach student asset', () => {
    const getComponentSpy = spyOnGetComponent('MultipleChoice');
    const broadcastAttachStudentAssetSpy = spyOnBroadcastAttachStudentAsset();
    component.attachStudentAsset(assetFile1);
    expect(getComponentSpy).toHaveBeenCalled();
    expect(broadcastAttachStudentAssetSpy).not.toHaveBeenCalled();
  });

  function spyOnUploadAsset() {
    return spyOn(TestBed.inject(StudentAssetService), 'uploadAsset').and.returnValue(
      Promise.resolve({})
    );
  }

  function spyOnGetComponent(componentType: string) {
    return spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue({
      type: componentType
    } as ComponentContent);
  }

  function spyOnBroadcastAttachStudentAsset() {
    return spyOn(
      TestBed.inject(StudentAssetService),
      'broadcastAttachStudentAsset'
    ).and.callFake(() => {});
  }
});
