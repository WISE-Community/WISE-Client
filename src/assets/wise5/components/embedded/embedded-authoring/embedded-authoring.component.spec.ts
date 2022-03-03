import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { configureTestSuite } from 'ng-bullet';
import { Observable, Subject } from 'rxjs';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { AnnotationService } from '../../../services/annotationService';
import { ConfigService } from '../../../services/configService';
import { NodeService } from '../../../services/nodeService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { StudentAssetService } from '../../../services/studentAssetService';
import { StudentDataService } from '../../../services/studentDataService';
import { TagService } from '../../../services/tagService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { UtilService } from '../../../services/utilService';
import { EmbeddedService } from '../embeddedService';
import { EmbeddedAuthoring } from './embedded-authoring.component';

export class MockConfigService {}

export class MockNodeService {
  private starterStateResponseSource: Subject<any> = new Subject<any>();
  public starterStateResponse$: Observable<any> = this.starterStateResponseSource.asObservable();
}

let component: EmbeddedAuthoring;
let fixture: ComponentFixture<EmbeddedAuthoring>;

describe('EmbeddedAuthoring', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        ReactiveFormsModule,
        UpgradeModule
      ],
      declarations: [EmbeddedAuthoring, EditComponentPrompt],
      providers: [
        AnnotationService,
        ConfigService,
        EmbeddedService,
        { provide: NodeService, useClass: MockNodeService },
        ProjectAssetService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        TeacherProjectService,
        UtilService
      ],
      schemas: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
    spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue(JSON.parse(JSON.stringify(componentContent)));
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });

  shouldSelectTheModelFile();
});

function createComponentContent() {
  return {
    id: '86fel4wjm4',
    type: 'Embedded',
    prompt: '',
    showSaveButton: false,
    showSubmitButton: false,
    url: 'glucose.html',
    showAddToNotebookButton: true,
    width: null
  };
}

function shouldSelectTheModelFile() {
  it('should select the model file', () => {
    component.nodeId = 'node1';
    component.componentId = 'component1';
    expect(component.authoringComponentContent.url).toEqual('glucose.html');
    spyOn(component, 'componentChanged').and.callFake(() => {});
    const args = {
      nodeId: 'node1',
      componentId: 'component1',
      target: 'modelFile',
      targetObject: {},
      assetItem: {
        fileName: 'thermo.html'
      }
    };
    component.assetSelected(args);
    expect(component.authoringComponentContent.url).toEqual('thermo.html');
  });
}
