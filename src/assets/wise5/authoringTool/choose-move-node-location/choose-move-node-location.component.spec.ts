import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseMoveNodeLocationComponent } from './choose-move-node-location.component';
import { MoveNodesService } from '../../services/moveNodesService';
import { RouterTestingModule } from '@angular/router/testing';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

let component: ChooseMoveNodeLocationComponent;
let fixture: ComponentFixture<ChooseMoveNodeLocationComponent>;
describe('ChooseMoveNodeLocationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseMoveNodeLocationComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, StudentTeacherCommonServicesModule],
      providers: [MoveNodesService, TeacherProjectService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    window.history.pushState(
      {
        selectedNodeIds: ['node1']
      },
      '',
      ''
    );
    fixture = TestBed.createComponent(ChooseMoveNodeLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
