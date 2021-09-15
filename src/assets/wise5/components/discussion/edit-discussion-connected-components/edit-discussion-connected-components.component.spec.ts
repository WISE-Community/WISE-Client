import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { UtilService } from '../../../services/utilService';
import { EditDiscussionConnectedComponentsComponent } from './edit-discussion-connected-components.component';
import { createConnectedComponentObject } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';

let component: EditDiscussionConnectedComponentsComponent;
let fixture: ComponentFixture<EditDiscussionConnectedComponentsComponent>;

describe('EditDiscussionConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatIconModule, UpgradeModule],
      declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditDiscussionConnectedComponentsComponent
      ],
      providers: [ConfigService, ProjectService, SessionService, UtilService]
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
