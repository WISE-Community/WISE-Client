import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditConnectedComponentTypeSelectComponent } from './edit-connected-component-type-select.component';
import { createConnectedComponentObject } from '../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';

describe('EditConnectedComponentTypeSelectComponent', () => {
  let component: EditConnectedComponentTypeSelectComponent;
  let fixture: ComponentFixture<EditConnectedComponentTypeSelectComponent>;
  const componentId1 = 'componentId1';
  const nodeId1 = 'nodeId1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditConnectedComponentTypeSelectComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentTypeSelectComponent);
    component = fixture.componentInstance;
    component.connectedComponent = createConnectedComponentObject(nodeId1, componentId1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
