import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { SessionService } from '../../../assets/wise5/services/sessionService';
import { UtilService } from '../../../assets/wise5/services/utilService';
import { EditConnectedComponentNodeSelectComponent } from './edit-connected-component-node-select.component';
import { createConnectedComponentObject } from '../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ComponentServiceLookupServiceModule } from '../../../assets/wise5/services/componentServiceLookupServiceModule';

describe('EditConnectedComponentNodeSelectComponent', () => {
  let component: EditConnectedComponentNodeSelectComponent;
  let fixture: ComponentFixture<EditConnectedComponentNodeSelectComponent>;
  const componentId1 = 'componentId1';
  const nodeId1 = 'nodeId1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ComponentServiceLookupServiceModule,
        FormsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatSelectModule
      ],
      declarations: [EditConnectedComponentNodeSelectComponent],
      providers: [ConfigService, ProjectService, SessionService, UtilService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentNodeSelectComponent);
    component = fixture.componentInstance;
    component.connectedComponent = createConnectedComponentObject(nodeId1, componentId1);
    spyOn(TestBed.inject(ProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      'node1'
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
