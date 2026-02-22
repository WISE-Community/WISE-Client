import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createConnectedComponentObject } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ProjectService } from '../../../services/projectService';
import { MultipleChoiceContent } from '../MultipleChoiceContent';
import { EditMultipleChoiceConnectedComponentsComponent } from './edit-multiple-choice-connected-components.component';

let component: EditMultipleChoiceConnectedComponentsComponent;
let fixture: ComponentFixture<EditMultipleChoiceConnectedComponentsComponent>;
const componentId1 = 'componentId1';
const nodeId1 = 'nodeId1';
describe('EditMultipleChoiceConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMultipleChoiceConnectedComponentsComponent, StudentTeacherCommonServicesModule],
      providers: [provideHttpClient(withInterceptorsFromDi())]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMultipleChoiceConnectedComponentsComponent);
    component = fixture.componentInstance;
    component.componentContent = {
      choiceType: 'checkbox',
      choices: []
    };
    fixture.detectChanges();
  });

  askIfWantToCopyChoices();
});

function createChoiceObject(id: string, text: string): any {
  return {
    id: id,
    text: text
  };
}

function askIfWantToCopyChoices() {
  describe('askIfWantToCopyChoices', () => {
    let connectedComponent: any;
    beforeEach(() => {
      const componentContent = {
        choices: [
          createChoiceObject('choice1', 'Spongebob'),
          createChoiceObject('choice2', 'Patrick')
        ],
        choiceType: 'radio'
      } as MultipleChoiceContent;
      spyOn(TestBed.inject(ProjectService), 'getComponent').and.returnValue(componentContent);
      connectedComponent = createConnectedComponentObject(nodeId1, componentId1, 'importWork');
    });
    it('should copy choices from connected component', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      expect(component.componentContent.choiceType).toEqual('checkbox');
      expect(component.componentContent.choices.length).toEqual(0);
      component.askIfWantToCopyChoices(connectedComponent);
      expect(component.componentContent.choiceType).toEqual('radio');
      expect(component.componentContent.choices.length).toEqual(2);
    });
    it('should not copy choices from connected component', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      expect(component.componentContent.choiceType).toEqual('checkbox');
      expect(component.componentContent.choices.length).toEqual(0);
      component.askIfWantToCopyChoices(connectedComponent);
      expect(component.componentContent.choiceType).toEqual('checkbox');
      expect(component.componentContent.choices.length).toEqual(0);
    });
  });
}
