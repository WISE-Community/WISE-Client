import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { RecoveryAuthoringComponent } from './recovery-authoring.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class MockTeacherProjectService {
  project = {
    nodes: []
  };

  saveProject() {}
}

class Node {
  id: string;
  ids: string[];
  transitionLogic: any;

  constructor(id: string, ids: string[], transitions: any[]) {
    this.id = id;
    this.ids = ids;
    this.transitionLogic = {
      transitions: transitions
    };
  }
}

let component: RecoveryAuthoringComponent;
let fixture: ComponentFixture<RecoveryAuthoringComponent>;
const groupId1 = 'group1';
const nodeId1 = 'node1';
const nodeId2 = 'node2';

describe('RecoveryAuthoringComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [RecoveryAuthoringComponent],
    imports: [BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatInputModule,
        RouterModule,
        StudentTeacherCommonServicesModule],
    providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: TeacherProjectService, useClass: MockTeacherProjectService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  projectJSONChanged();
  save();
});

function projectJSONChanged() {
  describe('projectJSONChanged()', () => {
    detectJSONValidity();
    detectPotentialProblems();
  });
}

function detectJSONValidity() {
  it('should detect json is invalid and disable save button', () => {
    setJSONAndExpect('abc', false, false);
  });

  it('should detect json is valid and enable save button', () => {
    setJSONAndExpect('{ "nodes": [] }', true, true);
  });
}

function setJSONAndExpect(json: string, jsonIsValid: boolean, saveButtonEnabled: boolean) {
  setProjectJSONStringAndTriggerChange(json);
  expect(component.jsonValid).toEqual(jsonIsValid);
  expect(component.saveButtonEnabled).toEqual(saveButtonEnabled);
}

function detectPotentialProblems() {
  it('should detect potential problem transition to null', () => {
    const projectJSON = {
      nodes: [new Node(nodeId1, null, [{ to: null }])]
    };
    setProjectJSONStringAndTriggerChange(JSON.stringify(projectJSON));
    expect(component.badNodes.length).toEqual(1);
    expect(component.badNodes[0].hasTransitionToNull).toEqual(true);
  });

  it('should detect potential problem reference to node id that does not exist', () => {
    const projectJSON = {
      nodes: [new Node(groupId1, [nodeId1, nodeId2], []), new Node(nodeId1, null, [])]
    };
    setProjectJSONStringAndTriggerChange(JSON.stringify(projectJSON));
    expect(component.badNodes.length).toEqual(1);
    expect(component.badNodes[0].referencedIdsThatDoNotExist).toEqual([nodeId2]);
  });

  it('should detect potential problem reference to node id duplicate', () => {
    const projectJSON = {
      nodes: [
        new Node(groupId1, [nodeId1, nodeId1], []),
        new Node(nodeId1, null, [{ to: nodeId2 }]),
        new Node(nodeId2, null, [])
      ]
    };
    setProjectJSONStringAndTriggerChange(JSON.stringify(projectJSON));
    expect(component.badNodes.length).toEqual(1);
    expect(component.badNodes[0].referencedIdsThatAreDuplicated).toEqual([nodeId1]);
  });
}

function setProjectJSONStringAndTriggerChange(jsonString: string): void {
  component.projectJSONString = jsonString;
  component.projectJSONChanged();
}

function save() {
  describe('save()', () => {
    it('should save and disable save button', () => {
      component.saveButtonEnabled = true;
      component.save();
      expect(component.saveButtonEnabled).toBeFalsy();
    });
  });
}
