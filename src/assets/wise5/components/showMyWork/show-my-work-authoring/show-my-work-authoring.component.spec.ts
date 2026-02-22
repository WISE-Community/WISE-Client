import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ShowMyWorkAuthoringComponent } from './show-my-work-authoring.component';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';

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
      imports: [ShowMyWorkAuthoringComponent, StudentTeacherCommonServicesModule],
      providers: [
        ProjectAssetService,
        TeacherNodeService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getLocale').and.returnValue(new ProjectLocale({ default: 'en-US' }));
    fixture = TestBed.createComponent(ShowMyWorkAuthoringComponent);
    spyOn(projectService, 'isDefaultLocale').and.returnValue(true);
    spyOn(projectService, 'getFlattenedProjectAsNodeIds').and.returnValue([nodeId1]);
    component1 = createComponent(componentId1, OPEN_RESPONSE_TYPE);
    component2 = createComponent(componentId2, OPEN_RESPONSE_TYPE);
    component3 = createComponent(componentId3, OPEN_RESPONSE_TYPE);
    component4 = createComponent(componentId4, HTML_TYPE);
    component = fixture.componentInstance;
    component.componentContent = {};
    fixture.detectChanges();
  });

  function createComponent(id: string, type: string): any {
    return {
      id: id,
      type: type
    };
  }

  it('should handle show work node id changed when there are multiple components', () => {
    component.componentContent.showWorkNodeId = nodeId1;
    component.componentContent.showWorkComponentId = componentId3;
    const components = [component1, component2];
    spyOn(TestBed.inject(TeacherProjectService), 'getComponents').and.returnValue(components);
    component.showWorkNodeIdChanged();
    expect(component.componentContent.showWorkNodeId).toEqual(nodeId1);
    expect(component.componentContent.showWorkComponentId).toEqual('');
  });

  it('should handle show work node id changed when there is one component', () => {
    component.componentContent.showWorkNodeId = nodeId1;
    component.componentContent.showWorkComponentId = componentId3;
    const components = [component1];
    spyOn(TestBed.inject(TeacherProjectService), 'getComponents').and.returnValue(components);
    component.showWorkNodeIdChanged();
    expect(component.componentContent.showWorkNodeId).toEqual(nodeId1);
    expect(component.componentContent.showWorkComponentId).toEqual(componentId1);
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
