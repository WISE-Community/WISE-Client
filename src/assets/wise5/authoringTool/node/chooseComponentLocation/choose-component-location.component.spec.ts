import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ChooseComponentLocationComponent } from './choose-component-location.component';
import { ComponentTypeService } from '../../../services/componentTypeService';
import { ConfigService } from '../../../services/configService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherProjectService } from '../../../services/teacherProjectService';

const nodeId = 'node1';
const components = [
  { id: 'comp1', type: 'OpenResponse' },
  { id: 'comp2', type: 'MultipleChoice' }
];

class MockProjectService {
  createComponent(componentType) {
    return { id: 'comp3', type: componentType };
  }

  getComponents() {
    return components;
  }

  saveProject() {
    return new Promise(() => {});
  }
}

class MockTeacherDataService {
  getCurrentNodeId() {
    return nodeId;
  }
}

class MockComponentTypeService {}

let component: ChooseComponentLocationComponent;
let teacherProjectService: TeacherProjectService;

describe('InsertComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChooseComponentLocationComponent,
        { provide: ComponentTypeService, useClass: MockComponentTypeService },
        ConfigService,
        { provide: TeacherProjectService, useClass: MockProjectService },
        { provide: TeacherDataService, useClass: MockTeacherDataService }
      ]
    });
    component = TestBed.inject(ChooseComponentLocationComponent);
    teacherProjectService = TestBed.inject(TeacherProjectService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
