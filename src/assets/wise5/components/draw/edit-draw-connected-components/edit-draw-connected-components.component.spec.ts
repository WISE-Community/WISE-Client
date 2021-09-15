import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { UtilService } from '../../../services/utilService';
import { EditDrawConnectedComponentsComponent } from './edit-draw-connected-components.component';
import { createConnectedComponentObject } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';

let component: EditDrawConnectedComponentsComponent;
let fixture: ComponentFixture<EditDrawConnectedComponentsComponent>;
const nodeId1 = 'node1';
const nodeId2 = 'node2';
const componentId1 = 'component1';
const componentId2 = 'component2';

describe('EditDrawConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatIconModule, UpgradeModule],
      declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditDrawConnectedComponentsComponent
      ],
      providers: [ConfigService, ProjectService, SessionService, UtilService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrawConnectedComponentsComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId1;
    fixture.detectChanges();
  });

  setUpdateOnIfApplicable();
});

function setUpdateOnIfApplicable() {
  describe('setUpdateOnIfApplicable', () => {
    it('should set update on field', () => {
      const connectedComponent = createConnectedComponentObject(
        nodeId1,
        componentId1,
        'importWork'
      );
      component.setUpdateOnIfApplicable(connectedComponent);
      expect(connectedComponent.updateOn).toEqual('submit');
    });
    it('should not set update on field', () => {
      const connectedComponent = createConnectedComponentObject(
        nodeId2,
        componentId2,
        'importWork'
      );
      component.setUpdateOnIfApplicable(connectedComponent);
      expect(connectedComponent.updateOn).toBeUndefined();
    });
  });
}
