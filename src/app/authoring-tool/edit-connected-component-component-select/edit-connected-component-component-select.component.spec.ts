import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditConnectedComponentComponentSelectComponent } from './edit-connected-component-component-select.component';
import { createConnectedComponentObject } from '../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';

describe('EditConnectedComponentComponentSelectComponent', () => {
  let component: EditConnectedComponentComponentSelectComponent;
  let fixture: ComponentFixture<EditConnectedComponentComponentSelectComponent>;
  const componentId1 = 'componentId1';
  const nodeId1 = 'nodeId1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatSelectModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [EditConnectedComponentComponentSelectComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentComponentSelectComponent);
    component = fixture.componentInstance;
    component.connectedComponent = createConnectedComponentObject(nodeId1, componentId1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
