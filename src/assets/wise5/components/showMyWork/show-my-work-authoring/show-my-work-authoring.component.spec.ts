import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { ConfigService } from '../../../services/configService';
import { NodeInfoService } from '../../../services/nodeInfoService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { ShowMyWorkAuthoringComponent } from './show-my-work-authoring.component';

describe('ShowMyWorkAuthoringComponent', () => {
  let component: ShowMyWorkAuthoringComponent;
  let component1;
  let component2;
  let component3;
  let component4;
  const componentId1 = 'component1';
  const componentId2 = 'component2';
  const componentId3 = 'component3';
  const componentId4 = 'component4';
  let fixture: ComponentFixture<ShowMyWorkAuthoringComponent>;
  const nodeId1 = 'node1';

  const HTML_TYPE = 'HTML';
  const OPEN_RESPONSE_TYPE = 'OpenResponse';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        UpgradeModule
      ],
      declarations: [EditComponentPrompt, ShowMyWorkAuthoringComponent],
      providers: [
        ConfigService,
        NodeService,
        NodeInfoService,
        ProjectAssetService,
        ProjectService,
        SessionService,
        TeacherProjectService,
        UtilService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMyWorkAuthoringComponent);
    spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue({});
    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      nodeId1
    ]);
    component1 = createComponent(componentId1, OPEN_RESPONSE_TYPE);
    component2 = createComponent(componentId2, OPEN_RESPONSE_TYPE);
    component3 = createComponent(componentId3, OPEN_RESPONSE_TYPE);
    component4 = createComponent(componentId4, HTML_TYPE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function createComponent(id: string, type: string): any {
    return {
      id: id,
      type: type
    };
  }

  it('should handle show work node id changed when there are multiple components', () => {
    component.authoringComponentContent.showWorkNodeId = nodeId1;
    component.authoringComponentContent.showWorkComponentId = componentId3;
    const components = [component1, component2];
    spyOn(TestBed.inject(TeacherProjectService), 'getComponentsByNodeId').and.returnValue(
      components
    );
    component.showWorkNodeIdChanged();
    expect(component.authoringComponentContent.showWorkNodeId).toEqual(nodeId1);
    expect(component.authoringComponentContent.showWorkComponentId).toEqual('');
  });

  it('should handle show work node id changed when there is one component', () => {
    component.authoringComponentContent.showWorkNodeId = nodeId1;
    component.authoringComponentContent.showWorkComponentId = componentId3;
    const components = [component1];
    spyOn(TestBed.inject(TeacherProjectService), 'getComponentsByNodeId').and.returnValue(
      components
    );
    component.showWorkNodeIdChanged();
    expect(component.authoringComponentContent.showWorkNodeId).toEqual(nodeId1);
    expect(component.authoringComponentContent.showWorkComponentId).toEqual(componentId1);
  });

  it('should check if allowed to show work for a component when it is this component', () => {
    component.componentId = componentId3;
    expect(component.isAllowedShowWorkComponent(component3)).toBeFalse();
  });

  it('should check if allowed to show work for a component when type is not allowed', () => {
    component.componentId = componentId3;
    expect(component.isAllowedShowWorkComponent(component4)).toBeFalse();
  });

  it('should check if allowed to show work for a component when it is allowed', () => {
    component.componentId = componentId3;
    expect(component.isAllowedShowWorkComponent(component2)).toBeTrue();
  });
});
