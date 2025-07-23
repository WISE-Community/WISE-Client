import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { ShowGroupWorkAuthoringComponent } from './show-group-work-authoring.component';
import { PeerGroupingAuthoringService } from '../../../services/peerGroupingAuthoringService';

describe('ShowGroupWorkAuthoringComponent', () => {
  let component: ShowGroupWorkAuthoringComponent;
  let fixture: ComponentFixture<ShowGroupWorkAuthoringComponent>;
  const nodeId1 = 'node1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowGroupWorkAuthoringComponent, StudentTeacherCommonServicesModule],
      providers: [
        PeerGroupingAuthoringService,
        ProjectAssetService,
        TeacherNodeService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getLocale').and.returnValue(new ProjectLocale({ default: 'en-US' }));
    fixture = TestBed.createComponent(ShowGroupWorkAuthoringComponent);
    spyOn(projectService, 'isDefaultLocale').and.returnValue(true);
    spyOn(projectService, 'getFlattenedProjectAsNodeIds').and.returnValue([nodeId1]);
    spyOn(projectService, 'getPeerGroupings').and.returnValue([]);
    component = fixture.componentInstance;
    component.componentContent = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
