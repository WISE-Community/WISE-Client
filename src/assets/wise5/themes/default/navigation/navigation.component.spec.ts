import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { UtilService } from '../../../services/utilService';
import { VLEProjectService } from '../../../vle/vleProjectService';
import { NavigationComponent } from './navigation.component';

class MockVLEProjectService {
  rootNode = { ids: [] };
}

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpgradeModule],
      declarations: [NavigationComponent],
      providers: [
        AnnotationService,
        ConfigService,
        ProjectService,
        SessionService,
        StudentDataService,
        TagService,
        UtilService,
        { provide: VLEProjectService, useClass: MockVLEProjectService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
