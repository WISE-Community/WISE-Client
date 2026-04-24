import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditAiChatAdvancedComponent } from './edit-ai-chat-advanced.component';
import { MockComponents, MockProviders } from 'ng-mocks';
import { NotebookService } from '../../../services/notebookService';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { ComponentServiceLookupService } from '../../../services/componentServiceLookupService';

describe('EditAiChatAdvancedComponent', () => {
  let component: EditAiChatAdvancedComponent;
  let fixture: ComponentFixture<EditAiChatAdvancedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EditAiChatAdvancedComponent,
        MockComponents(
          EditComponentJsonComponent,
          EditComponentWidthComponent,
          EditConnectedComponentsComponent
        )
      ],
      providers: [
        MockProviders(
          ComponentServiceLookupService,
          NotebookService,
          TeacherNodeService,
          TeacherProjectService
        )
      ]
    });
    fixture = TestBed.createComponent(EditAiChatAdvancedComponent);
    component = fixture.componentInstance;
    component.nodeId = 'node1';
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue({
      id: 'component1',
      type: 'aiChat'
    });
    spyOn(TestBed.inject(TeacherProjectService), 'getProject').and.returnValue({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
