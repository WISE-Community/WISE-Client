import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseMoveNodeLocationComponent } from './choose-move-node-location.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MoveNodesService } from '../../../services/moveNodesService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: ChooseMoveNodeLocationComponent;
let fixture: ComponentFixture<ChooseMoveNodeLocationComponent>;
describe('ChooseMoveNodeLocationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ChooseMoveNodeLocationComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [RouterTestingModule, StudentTeacherCommonServicesModule],
    providers: [MoveNodesService, TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
