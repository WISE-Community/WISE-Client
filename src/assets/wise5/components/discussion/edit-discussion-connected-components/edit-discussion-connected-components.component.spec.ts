import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditDiscussionConnectedComponentsComponent } from './edit-discussion-connected-components.component';
import { createConnectedComponentObject } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EditDiscussionConnectedComponentsComponent;
let fixture: ComponentFixture<EditDiscussionConnectedComponentsComponent>;

describe('EditDiscussionConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditDiscussionConnectedComponentsComponent
    ],
    imports: [MatIconModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDiscussionConnectedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  changeAllDiscussionConnectedComponentTypesToMatch();
});

function changeAllDiscussionConnectedComponentTypesToMatch() {
  describe('changeAllDiscussionConnectedComponentTypesToMatch', () => {
    it('should change all connected component types', () => {
      component.connectedComponents = [
        createConnectedComponentObject('node1', 'component1', 'showWork'),
        createConnectedComponentObject('node2', 'component2', 'importWork'),
        createConnectedComponentObject('node3', 'component3', 'showWork')
      ];
      component.changeAllDiscussionConnectedComponentTypesToMatch('importWork');
      for (const connectedComponent of component.connectedComponents) {
        expect(connectedComponent.type).toEqual('importWork');
      }
    });
  });
}
