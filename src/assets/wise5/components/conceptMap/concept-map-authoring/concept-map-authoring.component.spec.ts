import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
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

export class MockConfigService {}

let component: ConceptMapAuthoring;
let fixture: ComponentFixture<ConceptMapAuthoring>;

describe('ConceptMapAuthoring', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        ReactiveFormsModule,
        UpgradeModule
      ],
      declarations: [ConceptMapAuthoring, EditComponentPrompt],
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptMapAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
    spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue(JSON.parse(JSON.stringify(componentContent)));
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });
});

function createComponentContent() {
  return {
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
}
