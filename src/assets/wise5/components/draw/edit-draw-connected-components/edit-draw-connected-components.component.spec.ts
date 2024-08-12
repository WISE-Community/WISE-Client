import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditDrawConnectedComponentsComponent } from './edit-draw-connected-components.component';
import { createConnectedComponentObject } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EditDrawConnectedComponentsComponent;
let fixture: ComponentFixture<EditDrawConnectedComponentsComponent>;
const nodeId1 = 'node1';
const nodeId2 = 'node2';
const componentId1 = 'component1';
const componentId2 = 'component2';

describe('EditDrawConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditDrawConnectedComponentsComponent
    ],
    imports: [MatIconModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrawConnectedComponentsComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId1;
    fixture.detectChanges();
  });

  setUpdateOnIfApplicable();
});

function setUpdateOnIfApplicable() {
  describe('setUpdateOnIfApplicable', () => {
    it('should set update on field', () => {
      const connectedComponent = createConnectedComponentObject(
        nodeId1,
        componentId1,
        'importWork'
      );
      component.setUpdateOnIfApplicable(connectedComponent);
      expect(connectedComponent.updateOn).toEqual('submit');
    });
    it('should not set update on field', () => {
      const connectedComponent = createConnectedComponentObject(
        nodeId2,
        componentId2,
        'importWork'
      );
      component.setUpdateOnIfApplicable(connectedComponent);
      expect(connectedComponent.updateOn).toBeUndefined();
    });
  });
}
