import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAssetAuthoringComponent } from './project-asset-authoring.component';
import { ConfigService } from '../../services/configService';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ProjectAssetAuthoringComponent', () => {
  let component: ProjectAssetAuthoringComponent;
  let fixture: ComponentFixture<ProjectAssetAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        StudentTeacherCommonServicesModule,
        ProjectAssetAuthoringComponent
      ],
      providers: [ConfigService, ProjectAssetService, provideHttpClient(withInterceptorsFromDi())]
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
