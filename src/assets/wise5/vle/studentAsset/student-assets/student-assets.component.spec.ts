import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigService } from '../../../services/configService';
import { StudentAssetsComponent } from './student-assets.component';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { UtilService } from '../../../services/utilService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { ComponentServiceLookupServiceModule } from '../../../services/componentServiceLookupServiceModule';

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
      imports: [ComponentServiceLookupServiceModule, HttpClientTestingModule, UpgradeModule],
      declarations: [StudentAssetsComponent],
      providers: [ConfigService, ProjectService, SessionService, StudentAssetService, UtilService]
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
    const getComponentSpy = spyOnGetComponentByNodeIdAndComponentId('Draw');
    const files = [assetFile1, assetFile2];
    component.uploadStudentAssets(files);
    tick();
    expect(uploadAssetSpy).toHaveBeenCalledTimes(2);
    expect(getComponentSpy).toHaveBeenCalledTimes(2);
  }));

  it('should attach student asset', () => {
    const getComponentSpy = spyOnGetComponentByNodeIdAndComponentId('Draw');
    const broadcastAttachStudentAssetSpy = spyOnBroadcastAttachStudentAsset();
    component.attachStudentAsset(assetFile1);
    expect(getComponentSpy).toHaveBeenCalled();
    expect(broadcastAttachStudentAssetSpy).toHaveBeenCalled();
  });

  it('should not attach student asset', () => {
    const getComponentSpy = spyOnGetComponentByNodeIdAndComponentId('MultipleChoice');
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

  function spyOnGetComponentByNodeIdAndComponentId(componentType: string) {
    return spyOn(
      TestBed.inject(ProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue({
      type: componentType
    });
  }

  function spyOnBroadcastAttachStudentAsset() {
    return spyOn(
      TestBed.inject(StudentAssetService),
      'broadcastAttachStudentAsset'
    ).and.callFake(() => {});
  }
});
