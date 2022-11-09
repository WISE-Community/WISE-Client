import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditConnectedComponentsAddButtonComponent } from '../edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsWithBackgroundComponent } from './edit-connected-components-with-background.component';

let component: EditConnectedComponentsWithBackgroundComponent;
let fixture: ComponentFixture<EditConnectedComponentsWithBackgroundComponent>;
const componentId1 = 'componentId1';
const nodeId1 = 'node1';
const importWorkType = 'importWork';

describe('EditConnectedComponentsWithBackgroundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatIconModule, StudentTeacherCommonServicesModule],
      declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditConnectedComponentsWithBackgroundComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentsWithBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterComponentIdChanged();
});

function createConnectedComponentObject(nodeId: string, componentId: string, type: string): any {
  return {
    nodeId: nodeId,
    componentId: componentId,
    type: type
  };
}

function afterComponentIdChanged() {
  describe('afterComponentIdChanged', () => {
    let connectedComponent: any;
    let getComponentSpy: any;
    beforeEach(() => {
      component.componentTypesThatCanImportWorkAsBackground = ['Draw'];
      getComponentSpy = spyOn(TestBed.inject(ProjectService), 'getComponent');
      connectedComponent = createConnectedComponentObject(nodeId1, componentId1, importWorkType);
    });
    it('should set import work as background', () => {
      setSpyReturnComponentType(getComponentSpy, 'Draw');
      expect(connectedComponent.importWorkAsBackground).toBeUndefined();
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.importWorkAsBackground).toEqual(true);
    });
    it('should not set import work as background', () => {
      setSpyReturnComponentType(getComponentSpy, 'Graph');
      expect(connectedComponent.importWorkAsBackground).toBeUndefined();
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.importWorkAsBackground).toBeUndefined();
    });
  });
}

function setSpyReturnComponentType(getComponentSpy: any, type: string): void {
  getComponentSpy.and.returnValue({
    nodeId: nodeId1,
    componentId: componentId1,
    type: type
  });
}
