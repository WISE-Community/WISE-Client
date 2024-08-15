import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditGraphConnectedComponentsComponent } from './edit-graph-connected-components.component';
import { createConnectedComponentObject } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EditGraphConnectedComponentsComponent;
let fixture: ComponentFixture<EditGraphConnectedComponentsComponent>;
const nodeId1 = 'node1';
const componentId1 = 'component1';

describe('EditGraphConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditGraphConnectedComponentsComponent
    ],
    imports: [MatIconModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGraphConnectedComponentsComponent);
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
    it('should delete Embedded connected component fields', () => {
      connectedComponent.highlightLatestPoint = true;
      connectedComponent.showXPlotLineOnLatestPoint = true;
      connectedComponent.seriesNumbers = [1, 2];
      spyOn(component, 'getConnectedComponentType').and.returnValue('ConceptMap');
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.highlightLatestPoint).toBeUndefined();
      expect(connectedComponent.showXPlotLineOnLatestPoint).toBeUndefined();
      expect(connectedComponent.seriesNumbers).toBeUndefined();
    });
    it('should delete Table connected component fields', () => {
      connectedComponent.skipFirstRow = true;
      connectedComponent.xColumn = 1;
      connectedComponent.yColumn = 2;
      spyOn(component, 'getConnectedComponentType').and.returnValue('ConceptMap');
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.skipFirstRow).toBeUndefined();
      expect(connectedComponent.xColumn).toBeUndefined();
      expect(connectedComponent.yColumn).toBeUndefined();
    });
    it('should delete Graph connected component fields', () => {
      connectedComponent.importGraphSettings = true;
      connectedComponent.showClassmateWorkSource = true;
      spyOn(component, 'getConnectedComponentType').and.returnValue('ConceptMap');
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.importGraphSettings).toBeUndefined();
      expect(connectedComponent.showClassmateWorkSource).toBeUndefined();
    });
    it('should delete import work as background connected component field', () => {
      connectedComponent.importWorkAsBackground = true;
      spyOn(component, 'getConnectedComponentType').and.returnValue('Table');
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.importWorkAsBackground).toBeUndefined();
    });
    it('should set Table connected component fields', () => {
      spyOn(component, 'getConnectedComponentType').and.returnValue('Table');
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.skipFirstRow).toBeDefined();
      expect(connectedComponent.xColumn).toBeDefined();
      expect(connectedComponent.yColumn).toBeDefined();
    });
  });
}
