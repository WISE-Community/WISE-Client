import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { EditConnectedComponentsAddButtonComponent } from '../edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsComponent } from './edit-connected-components.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EditConnectedComponentsComponent;
let fixture: ComponentFixture<EditConnectedComponentsComponent>;
const componentId10 = 'component10';
const nodeId10 = 'node10';

describe('EditConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditConnectedComponentsAddButtonComponent, EditConnectedComponentsComponent],
    imports: [MatIconModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentsComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId10;
    component.componentId = componentId10;
    fixture.detectChanges();
  });

  addConnectedComponent();
  deleteConnectedComponent();
});

export function createConnectedComponentObject(
  nodeId: string,
  componentId: string,
  type: string = 'importWork'
): any {
  return {
    nodeId: nodeId,
    componentId: componentId,
    type: type
  };
}

function addConnectedComponent() {
  describe('addConnectedComponent', () => {
    it('should add a connected component', () => {
      expect(component.connectedComponents.length).toEqual(0);
      component.addConnectedComponent();
      expect(component.connectedComponents.length).toEqual(1);
    });
  });
}

function deleteConnectedComponent() {
  describe('deleteConnectedComponent', () => {
    it('should delete a connected component', () => {
      component.addConnectedComponent();
      expect(component.connectedComponents.length).toEqual(1);
      spyOn(window, 'confirm').and.returnValue(true);
      component.deleteConnectedComponent(0);
      expect(component.connectedComponents.length).toEqual(0);
    });
  });
}
