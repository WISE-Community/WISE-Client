import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAssetAuthoringComponent } from './project-asset-authoring.component';
import { ConfigService } from '../../services/configService';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ProjectAssetAuthoringModule } from './project-asset-authoring.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProjectAssetAuthoringComponent', () => {
  let component: ProjectAssetAuthoringComponent;
  let fixture: ComponentFixture<ProjectAssetAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectAssetAuthoringComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ProjectAssetAuthoringModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [ConfigService, ProjectAssetService]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectAssetAuthoringComponent);
    component = fixture.componentInstance;
    component.projectAssets = { files: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
