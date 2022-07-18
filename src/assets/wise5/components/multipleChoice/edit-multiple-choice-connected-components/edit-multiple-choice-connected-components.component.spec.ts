import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { ConfigService } from '../../../services/configService';
import { ProjectService } from '../../../services/projectService';
import { SessionService } from '../../../services/sessionService';
import { UtilService } from '../../../services/utilService';
import { EditMultipleChoiceConnectedComponentsComponent } from './edit-multiple-choice-connected-components.component';
import { createConnectedComponentObject } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';
import { ComponentServiceLookupServiceModule } from '../../../services/componentServiceLookupServiceModule';

let component: EditMultipleChoiceConnectedComponentsComponent;
let fixture: ComponentFixture<EditMultipleChoiceConnectedComponentsComponent>;
const componentId1 = 'componentId1';
const nodeId1 = 'nodeId1';

describe('EditMultipleChoiceConnectedComponentsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentServiceLookupServiceModule, HttpClientTestingModule, MatIconModule],
      declarations: [
        EditConnectedComponentsAddButtonComponent,
        EditMultipleChoiceConnectedComponentsComponent
      ],
      providers: [ConfigService, ProjectService, SessionService, UtilService]
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
      };
      spyOn(TestBed.inject(ProjectService), 'getComponentByNodeIdAndComponentId').and.returnValue(
        componentContent
      );
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
