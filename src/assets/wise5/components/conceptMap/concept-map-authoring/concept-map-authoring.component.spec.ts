import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { MockNodeService } from '../../common/MockNodeService';
import { ConceptMapService } from '../conceptMapService';
import { ConceptMapAuthoring } from './concept-map-authoring.component';
import { ConceptMapAuthoringModule } from './concept-map-authoring.module';

export class MockConfigService {}

let component: ConceptMapAuthoring;
let fixture: ComponentFixture<ConceptMapAuthoring>;

const componentContent = {
  id: 'ut00qpig10',
  type: 'ConceptMap',
  prompt: '',
  showSaveButton: false,
  showSubmitButton: false,
  width: 800,
  height: 600,
  background: null,
  stretchBackground: null,
  nodes: [
    {
      id: 'node1',
      label: 'Sun',
      fileName: 'sun.png',
      width: 100,
      height: 100
    },
    {
      id: 'node2',
      label: 'Space',
      fileName: 'Space.png',
      width: 100,
      height: 100
    },
    {
      id: 'node3',
      label: 'Earths Surface',
      fileName: 'Earth_surface.png',
      width: 100,
      height: 100
    },
    {
      id: 'node4',
      label: 'Beneath Surface',
      fileName: 'Earth_beneath.png',
      width: 100,
      height: 100
    }
  ],
  linksTitle: '',
  links: [
    {
      id: 'link1',
      label: 'Solar Radiation',
      color: '#DDD266'
    },
    {
      id: 'link2',
      label: 'Infrared Radiation',
      color: '#B62467'
    },
    {
      id: 'link3',
      label: 'Heat',
      color: '#DE2D26'
    }
  ],
  rules: [],
  starterConceptMap: null,
  customRuleEvaluator: '',
  showAutoScore: false,
  showAutoFeedback: false,
  showNodeLabels: true,
  showAddToNotebookButton: true
};

describe('ConceptMapAuthoringComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ConceptMapAuthoringModule, HttpClientTestingModule],
      declarations: [],
      providers: [
        AnnotationService,
        ConceptMapService,
        ConfigService,
        { provide: NodeService, useClass: MockNodeService },
        ProjectAssetService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        TeacherProjectService,
        UtilService
      ],
      schemas: []
    });
    fixture = TestBed.createComponent(ConceptMapAuthoring);
    component = fixture.componentInstance;
    spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue(JSON.parse(JSON.stringify(componentContent)));
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });
  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
