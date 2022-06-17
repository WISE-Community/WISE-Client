import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { UpgradeModule } from '@angular/upgrade/static';
import { ComponentServiceLookupServiceModule } from '../../../assets/wise5/services/componentServiceLookupServiceModule';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { SessionService } from '../../../assets/wise5/services/sessionService';
import { UtilService } from '../../../assets/wise5/services/utilService';
import { EditConnectedComponentsAddButtonComponent } from '../edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsWithBackgroundComponent } from './edit-connected-components-with-background.component';

let component: EditConnectedComponentsWithBackgroundComponent;
let fixture: ComponentFixture<EditConnectedComponentsWithBackgroundComponent>;
const componentId1 = 'componentId1';
const nodeId1 = 'node1';
const importWorkType = 'importWork';

describe('EditConnectedComponentsWithBackgroundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComponentServiceLookupServiceModule,
        HttpClientTestingModule,
        MatIconModule,
        UpgradeModule
      ],
      declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditConnectedComponentsWithBackgroundComponent
      ],
      providers: [ConfigService, ProjectService, SessionService, UtilService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentsWithBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterComponentIdChanged();
});

function createConnectedComponentObject(nodeId: string, componentId: string, type: string): any {
  return {
    nodeId: nodeId,
    componentId: componentId,
    type: type
  };
}

function afterComponentIdChanged() {
  describe('afterComponentIdChanged', () => {
    let connectedComponent: any;
    let getComponentByNodeIdAndComponentIdSpy: any;
    beforeEach(() => {
      component.componentTypesThatCanImportWorkAsBackground = ['Draw'];
      getComponentByNodeIdAndComponentIdSpy = spyOn(
        TestBed.inject(ProjectService),
        'getComponentByNodeIdAndComponentId'
      );
      connectedComponent = createConnectedComponentObject(nodeId1, componentId1, importWorkType);
    });
    it('should set import work as background', () => {
      setSpyReturnComponentType(getComponentByNodeIdAndComponentIdSpy, 'Draw');
      expect(connectedComponent.importWorkAsBackground).toBeUndefined();
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.importWorkAsBackground).toEqual(true);
    });
    it('should not set import work as background', () => {
      setSpyReturnComponentType(getComponentByNodeIdAndComponentIdSpy, 'Graph');
      expect(connectedComponent.importWorkAsBackground).toBeUndefined();
      component.afterComponentIdChanged(connectedComponent);
      expect(connectedComponent.importWorkAsBackground).toBeUndefined();
    });
  });
}

function setSpyReturnComponentType(getComponentByNodeIdAndComponentIdSpy: any, type: string): void {
  getComponentByNodeIdAndComponentIdSpy.and.returnValue({
    nodeId: nodeId1,
    componentId: componentId1,
    type: type
  });
}
