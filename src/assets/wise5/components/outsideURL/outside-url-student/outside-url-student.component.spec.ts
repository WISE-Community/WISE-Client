import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { ProjectService } from '../../../services/projectService';
import { OutsideUrlStudent } from './outside-url-student.component';

let component: OutsideUrlStudent;
const componentId = 'component1';
let fixture: ComponentFixture<OutsideUrlStudent>;
const nodeId = 'node1';

describe('OutsideUrlStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        ReactiveFormsModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [OutsideUrlStudent]
    });
    fixture = TestBed.createComponent(OutsideUrlStudent);
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    component = fixture.componentInstance;
    component.nodeId = nodeId;
    component.componentContent = {
      id: componentId,
      height: 600,
      width: 800,
      url: 'https://www.berkeley.edu'
    };
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    spyOn(component, 'broadcastDoneRenderingComponent').and.callFake(() => {});
    spyOn(component, 'isAddToNotebookEnabled').and.callFake(() => {
      return true;
    });
    spyOn(component, 'isNotebookEnabled').and.returnValue(false);
    spyOn(component, 'registerNotebookItemChosenListener').and.callFake(() => {});
    spyOn(component, 'studentDataChanged').and.callFake(() => {});
    fixture.detectChanges();
  });

  getHeight();
  getWidth();
});

function getWidth() {
  it('should get width', () => {
    expect(component.getWidth(component.componentContent)).toEqual('800px');
  });
}

function getHeight() {
  it('should get height', () => {
    expect(component.getHeight(component.componentContent)).toEqual('600px');
  });
}
