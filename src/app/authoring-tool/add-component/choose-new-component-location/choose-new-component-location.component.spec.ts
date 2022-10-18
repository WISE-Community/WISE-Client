import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { ComponentTypeService } from '../../../../assets/wise5/services/componentTypeService';
import { ConfigService } from '../../../../assets/wise5/services/configService';
import { TeacherDataService } from '../../../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../../../assets/wise5/services/teacherProjectService';
import { UtilService } from '../../../../assets/wise5/services/utilService';
import { ChooseNewComponentLocation } from './choose-new-component-location.component';

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

class MockUpgradeModule {
  $injector: any = {
    get() {
      return { componentType: 'Discussion' };
    }
  };
}

class MockComponentTypeService {}

let component: ChooseNewComponentLocation;
let teacherProjectService: TeacherProjectService;

describe('ChooseNewComponentLocation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChooseNewComponentLocation,
        { provide: ComponentTypeService, useClass: MockComponentTypeService },
        ConfigService,
        { provide: TeacherProjectService, useClass: MockProjectService },
        { provide: TeacherDataService, useClass: MockTeacherDataService },
        { provide: UpgradeModule, useClass: MockUpgradeModule },
        UtilService
      ]
    });
    component = TestBed.inject(ChooseNewComponentLocation);
    teacherProjectService = TestBed.inject(TeacherProjectService);
  });

  it('should have nodeId and components set after initialization', () => {
    component.ngOnInit();
    expect(component.nodeId).toEqual(nodeId);
    expect(component.components).toEqual(components);
  });

  it('insertComponentAfter() should create a new component and save the project', () => {
    spyOn(teacherProjectService, 'createComponent').and.returnValue({
      id: 'comp3',
      type: 'Discussion'
    });
    spyOn(teacherProjectService, 'saveProject').and.returnValue(new Promise(() => {}));
    component.insertComponentAfter('comp2');
    expect(teacherProjectService.createComponent).toHaveBeenCalled();
    expect(teacherProjectService.saveProject).toHaveBeenCalled();
  });
});
