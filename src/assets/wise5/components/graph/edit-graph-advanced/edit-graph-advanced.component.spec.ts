import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditCommonAdvancedComponent } from '../../../../../app/authoring-tool/edit-common-advanced/edit-common-advanced.component';
import { EditComponentAddToNotebookButtonComponent } from '../../../../../app/authoring-tool/edit-component-add-to-notebook-button/edit-component-add-to-notebook-button.component';
import { EditComponentExcludeFromTotalScoreComponent } from '../../../../../app/authoring-tool/edit-component-exclude-from-total-score/edit-component-exclude-from-total-score.component';
import { EditComponentJsonComponent } from '../../../../../app/authoring-tool/edit-component-json/edit-component-json.component';
import { EditComponentMaxScoreComponent } from '../../../../../app/authoring-tool/edit-component-max-score/edit-component-max-score.component';
import { EditComponentRubricComponent } from '../../../../../app/authoring-tool/edit-component-rubric/edit-component-rubric.component';
import { EditComponentSaveButtonComponent } from '../../../../../app/authoring-tool/edit-component-save-button/edit-component-save-button.component';
import { EditComponentSubmitButtonComponent } from '../../../../../app/authoring-tool/edit-component-submit-button/edit-component-submit-button.component';
import { EditComponentTagsComponent } from '../../../../../app/authoring-tool/edit-component-tags/edit-component-tags.component';
import { EditComponentWidthComponent } from '../../../../../app/authoring-tool/edit-component-width/edit-component-width.component';
import { EditConnectedComponentsAddButtonComponent } from '../../../../../app/authoring-tool/edit-connected-components-add-button/edit-connected-components-add-button.component';
import { EditConnectedComponentsComponent } from '../../../../../app/authoring-tool/edit-connected-components/edit-connected-components.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { NotebookService } from '../../../services/notebookService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditGraphAdvancedComponent } from './edit-graph-advanced.component';

let component: EditGraphAdvancedComponent;
let fixture: ComponentFixture<EditGraphAdvancedComponent>;

describe('EditGraphAdvancedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [
        EditComponentAddToNotebookButtonComponent,
        EditCommonAdvancedComponent,
        EditComponentExcludeFromTotalScoreComponent,
        EditComponentJsonComponent,
        EditComponentMaxScoreComponent,
        EditComponentRubricComponent,
        EditComponentSaveButtonComponent,
        EditComponentSubmitButtonComponent,
        EditComponentTagsComponent,
        EditComponentWidthComponent,
        EditConnectedComponentsAddButtonComponent,
        EditConnectedComponentsComponent,
        EditGraphAdvancedComponent
      ],
      providers: [TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    spyOn(
      TestBed.inject(TeacherProjectService),
      'getComponentByNodeIdAndComponentId'
    ).and.returnValue({
      xAxis: {},
      yAxis: {}
    });
    spyOn(TestBed.inject(NotebookService), 'isNotebookEnabled').and.returnValue(true);
    fixture = TestBed.createComponent(EditGraphAdvancedComponent);
    component = fixture.componentInstance;
    spyOn(component, 'setShowSubmitButtonValue').and.callFake(() => {});
    spyOn(component, 'componentChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  addXAxisPlotLine();
  addYAxisPlotLine();
  deleteXAxisPlotLine();
  deleteYAxisPlotLine();
});

function addXAxisPlotLine() {
  describe('addXAxisPlotLine', () => {
    it('should add x axis plot line', () => {
      component.addXAxisPlotLine();
      expect(component.authoringComponentContent.xAxis.plotLines.length).toEqual(1);
      expect(component.authoringComponentContent.xAxis.plotLines[0].label.text).toEqual('');
      expect(component.authoringComponentContent.xAxis.plotLines[0].label.verticalAlign).toEqual(
        'bottom'
      );
      expect(component.authoringComponentContent.xAxis.plotLines[0].label.textAlign).toEqual(
        'right'
      );
    });
  });
}

function addYAxisPlotLine() {
  describe('addYAxisPlotLine', () => {
    it('should add y axis plot line', () => {
      component.addYAxisPlotLine();
      expect(component.authoringComponentContent.yAxis.plotLines.length).toEqual(1);
      expect(component.authoringComponentContent.yAxis.plotLines[0].label.text).toEqual('');
    });
  });
}

function deleteXAxisPlotLine() {
  describe('deleteXAxisPlotLine', () => {
    it('should delete x axis plot line', () => {
      component.authoringComponentContent.xAxis.plotLines = [{}, {}];
      component.deleteXAxisPlotLine(0);
      expect(component.authoringComponentContent.xAxis.plotLines.length).toEqual(1);
    });
  });
}

function deleteYAxisPlotLine() {
  describe('deleteYAxisPlotLine', () => {
    it('should delete y axis plot line', () => {
      component.authoringComponentContent.yAxis.plotLines = [{}, {}];
      component.deleteYAxisPlotLine(0);
      expect(component.authoringComponentContent.yAxis.plotLines.length).toEqual(1);
    });
  });
}
