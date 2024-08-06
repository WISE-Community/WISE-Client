import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditLabelConnectedComponentsComponent } from './edit-label-connected-components.component';
import { createConnectedComponentObject } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EditLabelConnectedComponentsComponent;
let fixture: ComponentFixture<EditLabelConnectedComponentsComponent>;
const nodeId1 = 'node1';
const componentId1 = 'component1';

describe('EditLabelConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditLabelConnectedComponentsComponent
    ],
    imports: [MatIconModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabelConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterComponentIdChanged();
});

function afterComponentIdChanged() {
  describe('afterComponentIdChanged', () => {
    let connectedComponent: any;
    beforeEach(() => {
      connectedComponent = createConnectedComponentObject(nodeId1, componentId1, 'importWork');
    });
    it('should delete Open Response connected component fields', () => {
      connectedComponent.charactersPerLine = 100;
      connectedComponent.spaceInbetweenLines = 40;
      connectedComponent.fontSize = 16;
      spyOn(component, 'getConnectedComponentType').and.returnValue('Label');
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.charactersPerLine).toBeUndefined();
      expect(connectedComponent.spaceInbetweenLines).toBeUndefined();
      expect(connectedComponent.fontSize).toBeUndefined();
    });
    it('should add Open Response connected component fields', () => {
      spyOn(component, 'getConnectedComponentType').and.returnValue('OpenResponse');
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.charactersPerLine).toEqual(100);
      expect(connectedComponent.spaceInbetweenLines).toEqual(40);
      expect(connectedComponent.fontSize).toEqual(16);
    });
  });
}
