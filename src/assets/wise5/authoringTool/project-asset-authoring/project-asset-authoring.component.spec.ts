import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAssetAuthoringComponent } from './project-asset-authoring.component';
import { ConfigService } from '../../services/configService';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ProjectAssetAuthoringModule } from './project-asset-authoring.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ProjectAssetAuthoringComponent', () => {
  let component: ProjectAssetAuthoringComponent;
  let fixture: ComponentFixture<ProjectAssetAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ProjectAssetAuthoringComponent],
    imports: [BrowserAnimationsModule,
        ProjectAssetAuthoringModule,
        StudentTeacherCommonServicesModule],
    providers: [ConfigService, ProjectAssetService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
