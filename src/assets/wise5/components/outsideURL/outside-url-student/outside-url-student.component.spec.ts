import { CommonModule } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { ProjectService } from '../../../services/projectService';
import { OutsideUrlStudent } from './outside-url-student.component';
import { OutsideUrlContent } from '../OutsideUrlContent';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: OutsideUrlStudent;
const componentId = 'component1';
let fixture: ComponentFixture<OutsideUrlStudent>;
const nodeId = 'node1';

describe('OutsideUrlStudentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    declarations: [OutsideUrlStudent],
    imports: [BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatIconModule,
        ReactiveFormsModule,
        StudentTeacherCommonServicesModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    fixture = TestBed.createComponent(OutsideUrlStudent);
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    spyOn(TestBed.inject(ProjectService), 'getThemeSettings').and.returnValue({});
    component = fixture.componentInstance;
    const componentContent = {
      id: componentId,
      height: 600,
      width: 800,
      url: 'https://www.berkeley.edu'
    } as OutsideUrlContent;
    component.component = new Component(componentContent, nodeId);
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
