import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { copy } from '../../../common/object/object';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ConceptMapAuthoring } from './concept-map-authoring.component';
import { ConceptMapAuthoringModule } from './concept-map-authoring.module';

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
      imports: [
        BrowserAnimationsModule,
        ConceptMapAuthoringModule,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ]
    });
    fixture = TestBed.createComponent(ConceptMapAuthoring);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      copy(componentContent)
    );
    component.componentContent = copy(componentContent);
    fixture.detectChanges();
  });
  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
