import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAssetService } from '../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ConfigService } from '../../services/configService';
import { ProjectAssetAuthoringComponent } from './project-asset-authoring.component';

describe('ProjectAssetAuthoringComponent', () => {
  let component: ProjectAssetAuthoringComponent;
  let fixture: ComponentFixture<ProjectAssetAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTeacherCommonServicesModule, ProjectAssetAuthoringComponent],
      providers: [ConfigService, ProjectAssetService, provideHttpClient()]
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
