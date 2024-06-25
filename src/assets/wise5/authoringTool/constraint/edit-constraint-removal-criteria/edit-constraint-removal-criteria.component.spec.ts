import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Constraint } from '../../../../../app/domain/constraint';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { EditConstraintRemovalCriteriaComponent } from './edit-constraint-removal-criteria.component';
import { ComponentContent } from '../../../common/ComponentContent';

let component: EditConstraintRemovalCriteriaComponent;
const componentId1: string = 'component1';
const componentId2: string = 'component2';
const componentId3: string = 'component3';
const componentId4: string = 'component4';
const componentId5: string = 'component5';
const componentId6: string = 'component6';
const componentTypeMultipleChoice: string = 'MultipleChoice';
const componentTypeOpenResponse: string = 'OpenResponse';
const componentTypeTable: string = 'Table';
let fixture: ComponentFixture<EditConstraintRemovalCriteriaComponent>;
const nodeId1: string = 'node1';
const nodeId2: string = 'node2';
const nodeId3: string = 'node3';
let removalCriteria: any;

describe('EditConstraintRemovalCriteriaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        EditConstraintRemovalCriteriaComponent,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();

    spyOn(TestBed.inject(TeacherProjectService), 'getFlattenedProjectAsNodeIds').and.returnValue([
      nodeId1,
      nodeId2,
      nodeId3
    ]);
    TestBed.inject(TeacherProjectService).idToNode = {
      node1: createNode(nodeId1, [
        createComponent(componentId1, componentTypeMultipleChoice),
        createComponent(componentId2, componentTypeOpenResponse),
        createComponent(componentId3, componentTypeTable)
      ]),
      node2: createNode(nodeId2, [
        createComponent(componentId4, componentTypeMultipleChoice),
        createComponent(componentId5, componentTypeMultipleChoice)
      ]),
      node3: createNode(nodeId3, [createComponent(componentId6, componentTypeOpenResponse)])
    };
    fixture = TestBed.createComponent(EditConstraintRemovalCriteriaComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    removalCriteria = {
      name: '',
      params: {}
    };
    component.criteria = removalCriteria;
    component.constraint = new Constraint({
      id: 'node1Constraint1',
      action: '',
      removalConditional: 'any',
      removalCriteria: [removalCriteria]
    });
    component.node = { id: 'node1' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function createNode(id: string, components: any[]): any {
  return { id, components };
}

function createComponent(id: string, type: string): ComponentContent {
  return { id, type };
}
