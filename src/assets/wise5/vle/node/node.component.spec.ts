import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentService } from '../../components/componentService';
import { AnnotationService } from '../../services/annotationService';
import { ConfigService } from '../../services/configService';
import { NodeService } from '../../services/nodeService';
import { ProjectService } from '../../services/projectService';
import { SessionService } from '../../services/sessionService';
import { StudentDataService } from '../../services/studentDataService';
import { TagService } from '../../services/tagService';
import { UtilService } from '../../services/utilService';
import { VLEProjectService } from '../vleProjectService';
import { NodeComponent } from './node.component';

let component: NodeComponent;
let createComponentStatesSpy: jasmine.Spy;
let fixture: ComponentFixture<NodeComponent>;

describe('NodeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [NodeComponent],
      providers: [
        AnnotationService,
        ComponentService,
        ConfigService,
        NodeService,
        ProjectService,
        SessionService,
        StudentDataService,
        TagService,
        UtilService,
        VLEProjectService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    spyOn(TestBed.inject(ConfigService), 'isRunActive').and.returnValue(true);
    spyOn(TestBed.inject(StudentDataService), 'getCurrentNode').and.returnValue({});
    spyOn(TestBed.inject(StudentDataService), 'getNodeStatusByNodeId').and.returnValue({});
    spyOn(TestBed.inject(StudentDataService), 'saveVLEEvent').and.callFake(() => {
      return Promise.resolve({});
    });
    spyOn(TestBed.inject(VLEProjectService), 'isApplicationNode').and.returnValue(true);
    spyOn(TestBed.inject(VLEProjectService), 'getNodeById').and.returnValue({ components: [] });
    spyOn(TestBed.inject(VLEProjectService), 'getNodeTitle').and.returnValue('');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    createComponentStatesSpy.and.callFake(() => {
      return Promise.resolve([]);
    });
    fixture.destroy();
  });
});
