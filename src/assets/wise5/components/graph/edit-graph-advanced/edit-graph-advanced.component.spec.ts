import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCommonAdvancedComponent } from '../../../../../app/authoring-tool/edit-common-advanced/edit-common-advanced.component';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { NotebookService } from '../../../services/notebookService';
import { TeacherNodeService } from '../../../services/teacherNodeService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { GraphContent } from '../GraphContent';
import { EditGraphAdvancedComponent } from './edit-graph-advanced.component';

let component: EditGraphAdvancedComponent;
let fixture: ComponentFixture<EditGraphAdvancedComponent>;
describe('EditGraphAdvancedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditGraphAdvancedComponent,
        EditCommonAdvancedComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        TeacherNodeService,
        TeacherProjectService,
        TeacherProjectTranslationService,
        provideHttpClient(withInterceptorsFromDi())
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'getComponent').and.returnValue({
      xAxis: {},
      yAxis: {}
    } as GraphContent);
    spyOn(projectService, 'getLocale').and.returnValue(new ProjectLocale({ default: 'en-US' }));
    spyOn(projectService, 'isDefaultLocale').and.returnValue(true);
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
      expect(component.componentContent.xAxis.plotLines.length).toEqual(1);
      expect(component.componentContent.xAxis.plotLines[0].label.text).toEqual('');
      expect(component.componentContent.xAxis.plotLines[0].label.verticalAlign).toEqual('bottom');
      expect(component.componentContent.xAxis.plotLines[0].label.textAlign).toEqual('right');
    });
  });
}

function addYAxisPlotLine() {
  describe('addYAxisPlotLine', () => {
    it('should add y axis plot line', () => {
      component.addYAxisPlotLine();
      expect(component.componentContent.yAxis.plotLines.length).toEqual(1);
      expect(component.componentContent.yAxis.plotLines[0].label.text).toEqual('');
    });
  });
}

function deleteXAxisPlotLine() {
  describe('deleteXAxisPlotLine', () => {
    it('should delete x axis plot line', () => {
      component.componentContent.xAxis.plotLines = [{}, {}];
      component.deleteXAxisPlotLine(0);
      expect(component.componentContent.xAxis.plotLines.length).toEqual(1);
    });
  });
}

function deleteYAxisPlotLine() {
  describe('deleteYAxisPlotLine', () => {
    it('should delete y axis plot line', () => {
      component.componentContent.yAxis.plotLines = [{}, {}];
      component.deleteYAxisPlotLine(0);
      expect(component.componentContent.yAxis.plotLines.length).toEqual(1);
    });
  });
}
