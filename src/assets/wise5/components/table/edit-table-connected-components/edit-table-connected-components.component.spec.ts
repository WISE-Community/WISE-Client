import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createConnectedComponentObject } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { EditTableConnectedComponentsComponent } from './edit-table-connected-components.component';

let component: EditTableConnectedComponentsComponent;
let fixture: ComponentFixture<EditTableConnectedComponentsComponent>;
const componentId1 = 'componentId1';
const nodeId1 = 'nodeId1';
describe('EditTableConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTableConnectedComponentsComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTableConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterComponentIdChanged();
});

function afterComponentIdChanged() {
  describe('afterComponentIdChanged', () => {
    it('should remove the showDataAtMouseX field if the connected component is not Graph', () => {
      const connectedComponent = createConnectedComponentObject(nodeId1, componentId1);
      connectedComponent.showDataAtMouseX = true;
      spyOn(component, 'getConnectedComponentType').and.returnValue('Table');
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.showDataAtMouseX).toBeUndefined();
    });
  });
}
