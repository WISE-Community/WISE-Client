import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditComponentPrompt } from '../../../../../app/authoring-tool/edit-component-prompt/edit-component-prompt.component';
import { ProjectAssetService } from '../../../../../app/services/projectAssetService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { NodeService } from '../../../services/nodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MockNodeService } from '../../common/MockNodeService';
import { AnimationAuthoring } from './animation-authoring.component';

export class MockConfigService {}

let component: AnimationAuthoring;
let fixture: ComponentFixture<AnimationAuthoring>;

describe('AnimationAuthoring', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        ReactiveFormsModule,
        UpgradeModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [AnimationAuthoring, EditComponentPrompt],
      providers: [
        { provide: NodeService, useClass: MockNodeService },
        ProjectAssetService,
        TeacherProjectService
      ]
    });
    fixture = TestBed.createComponent(AnimationAuthoring);
    component = fixture.componentInstance;
    const componentContent = createComponentContent();
    spyOn(TestBed.inject(TeacherProjectService), 'getComponent').and.returnValue(
      JSON.parse(JSON.stringify(componentContent))
    );
    spyOn(component, 'componentChanged');
    component.componentContent = JSON.parse(JSON.stringify(componentContent));
    fixture.detectChanges();
  });

  shouldAddAnAnimationObject();
  shouldAddADataPointToAnAnimationObject();
  shouldAddADataSourceFromAnAnimationObject();
  shouldDeleteADataSourceFromAnAnimationObject();
});

function createComponentContent() {
  return {
    id: '3tyam4h4iy',
    type: 'Animation',
    prompt: '',
    showSaveButton: false,
    showSubmitButton: false,
    widthInPixels: 600,
    widthInUnits: 60,
    heightInPixels: 200,
    heightInUnits: 20,
    dataXOriginInPixels: 0,
    dataYOriginInPixels: 80,
    coordinateSystem: 'screen',
    objects: [],
    showAddToNotebookButton: true
  };
}

function shouldAddAnAnimationObject() {
  it('should add an animation object', () => {
    component.addObject();
    expect(component.componentContent.objects.length).toEqual(1);
  });
}

function shouldAddADataPointToAnAnimationObject() {
  it('should add a data point to an animation object', () => {
    const animationObject: any = {};
    component.addDataPointToObject(animationObject);
    expect(animationObject.data.length).toEqual(1);
  });
}

function shouldAddADataSourceFromAnAnimationObject() {
  it('should add a data source from an animation object', () => {
    const animationObject: any = {};
    component.addDataSource(animationObject);
    expect(animationObject.dataSource).not.toBeNull();
  });
}

function shouldDeleteADataSourceFromAnAnimationObject() {
  it('should delete a data source from an animation object', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const animationObject = {
      dataSource: {}
    };
    component.deleteDataSource(animationObject);
    expect(animationObject.hasOwnProperty('dataSource')).toBeFalsy();
  });
}
