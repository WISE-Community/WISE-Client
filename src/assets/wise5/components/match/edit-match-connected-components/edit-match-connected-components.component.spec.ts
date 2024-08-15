import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { ProjectService } from '../../../services/projectService';
import { EditMatchConnectedComponentsComponent } from './edit-match-connected-components.component';
import { createConnectedComponentObject } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MatchContent } from '../MatchContent';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EditMatchConnectedComponentsComponent;
let fixture: ComponentFixture<EditMatchConnectedComponentsComponent>;
const componentId1 = 'componentId1';
const nodeId1 = 'nodeId1';

describe('EditMatchConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditMatchConnectedComponentsComponent
    ],
    imports: [MatIconModule, StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMatchConnectedComponentsComponent);
    component = fixture.componentInstance;
    component.componentContent = {
      choices: [],
      buckets: []
    };
    fixture.detectChanges();
  });

  askIfWantToCopyChoicesAndBuckets();
});

function createChoice(id: string, value: string): any {
  return {
    id: id,
    type: 'choice',
    value: value
  };
}

function createBucket(id: string, value: string): any {
  return {
    id: id,
    type: 'bucket',
    value: value
  };
}

function askIfWantToCopyChoicesAndBuckets() {
  describe('askIfWantToCopyChoicesAndBuckets', () => {
    let connectedComponent;
    beforeEach(() => {
      const componentContent = {
        id: componentId1,
        choices: [createChoice('choice1', 'A Choice')],
        buckets: [createBucket('bucket1', 'A Bucket')]
      } as MatchContent;
      spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue(componentContent);
      connectedComponent = createConnectedComponentObject(nodeId1, componentId1, 'importWork');
    });
    it('should copy choices and buckets from the connected component', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.askIfWantToCopyChoicesAndBuckets(connectedComponent);
      expect(component.componentContent.choices.length).toEqual(1);
      expect(component.componentContent.buckets.length).toEqual(1);
    });
    it('should not copy choices and buckets from the connected component', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.askIfWantToCopyChoicesAndBuckets(connectedComponent);
      expect(component.componentContent.choices.length).toEqual(0);
      expect(component.componentContent.buckets.length).toEqual(0);
    });
  });
}
