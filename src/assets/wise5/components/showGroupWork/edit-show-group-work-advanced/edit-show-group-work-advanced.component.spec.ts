import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { NotebookService } from '../../../services/notebookService';
import { NotificationService } from '../../../services/notificationService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { EditShowGroupWorkAdvancedComponent } from './edit-show-group-work-advanced.component';

describe('EditShowGroupWorkAdvancedComponent', () => {
  let component: EditShowGroupWorkAdvancedComponent;
  let fixture: ComponentFixture<EditShowGroupWorkAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        UpgradeModule
      ],
      declarations: [EditComponentJsonComponent, EditShowGroupWorkAdvancedComponent],
      providers: [
        AnnotationService,
        ConfigService,
        NotebookService,
        NodeService,
        NotificationService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        TeacherProjectService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShowGroupWorkAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
