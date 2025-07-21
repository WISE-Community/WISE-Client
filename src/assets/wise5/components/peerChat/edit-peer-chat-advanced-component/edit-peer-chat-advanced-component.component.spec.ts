import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProviders } from 'ng-mocks';
import { NotebookService } from '../../../services/notebookService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { PeerChatContent } from '../PeerChatContent';
import { EditPeerChatAdvancedComponentComponent } from './edit-peer-chat-advanced-component.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';

describe('EditPeerChatAdvancedComponentComponent', () => {
  let component: EditPeerChatAdvancedComponentComponent;
  let fixture: ComponentFixture<EditPeerChatAdvancedComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPeerChatAdvancedComponentComponent, MockComponent(EditComponentJsonComponent)],
      providers: [
        MockProviders(TeacherNodeService, TeacherProjectService, NotebookService),
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      {} as PeerChatContent
    );
    fixture = TestBed.createComponent(EditPeerChatAdvancedComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
