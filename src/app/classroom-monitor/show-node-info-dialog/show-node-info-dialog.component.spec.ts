import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PreviewComponentComponent } from '../../../assets/wise5/authoringTool/components/preview-component/preview-component.component';
import { ClassroomMonitorTestingModule } from '../../../assets/wise5/classroomMonitor/classroom-monitor-testing.module';
import { NodeInfoComponent } from '../../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/node-info/node-info.component';
import { OpenResponseStudent } from '../../../assets/wise5/components/openResponse/open-response-student/open-response-student.component';
import { ComponentHeader } from '../../../assets/wise5/directives/component-header/component-header.component';
import { PromptComponent } from '../../../assets/wise5/directives/prompt/prompt.component';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { TeacherDataService } from '../../../assets/wise5/services/teacherDataService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { VLEProjectService } from '../../../assets/wise5/vle/vleProjectService';
import { ShowNodeInfoDialogComponent } from './show-node-info-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentTypeServiceModule } from '../../../assets/wise5/services/componentTypeService.module';

let component: ShowNodeInfoDialogComponent;
const componentRubric: string = 'This is the component rubric.';
let fixture: ComponentFixture<ShowNodeInfoDialogComponent>;
const nodeId1: string = 'node1';
const prompt: string = 'This is the prompt.';
const stepRubric: string = 'This is the step rubric.';
const stepTitle: string = 'This is the title';

const node: any = {
  components: [
    {
      id: 'component1',
      type: 'OpenResponse',
      prompt: prompt,
      rubric: componentRubric
    }
  ],
  id: nodeId1,
  rubric: stepRubric,
  title: stepTitle
};

describe('ShowNodeInfoDialogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ComponentHeader,
        NodeInfoComponent,
        OpenResponseStudent,
        PreviewComponentComponent,
        ShowNodeInfoDialogComponent
      ],
      imports: [
        ClassroomMonitorTestingModule,
        ComponentTypeServiceModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatToolbarModule,
        PromptComponent
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: nodeId1 },
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowNodeInfoDialogComponent);
    component = fixture.componentInstance;
    component.nodeId = nodeId1;
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentPeriodId').and.returnValue(1);
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue(node);
    spyOn(TestBed.inject(ProjectService), 'getNodeById').and.returnValue(node);
    spyOn(TestBed.inject(ProjectService), 'getNodePositionById').and.returnValue('1.1');
    spyOn(TestBed.inject(VLEProjectService), 'getSpaces').and.returnValue([]);
    spyOn(TestBed.inject(ProjectService), 'getSpeechToTextSettings').and.returnValue({});
    spyOn(TestBed.inject(NotebookService), 'isNotebookEnabled').and.returnValue(false);
    fixture.detectChanges();
  });

  it('should render the step content in the dialog', () => {
    expect(fixture.debugElement.nativeElement.innerHTML).toContain(component.stepNumberAndTitle);
    expect(fixture.debugElement.nativeElement.innerHTML).toContain(prompt);
    expect(fixture.debugElement.nativeElement.innerHTML).toContain(stepRubric);
    expect(fixture.debugElement.nativeElement.innerHTML).toContain(componentRubric);
  });
});
