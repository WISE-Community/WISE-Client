import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeAuthoringComponent } from './node-authoring.component';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CopyComponentService } from '../../../services/copyComponentService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatDialogModule } from '@angular/material/dialog';
import { InsertComponentService } from '../../../services/insertComponentService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';

describe('NodeAuthoringComponent', () => {
  let component: NodeAuthoringComponent;
  let fixture: ComponentFixture<NodeAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeAuthoringComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        StudentTeacherCommonServicesModule,
        UpgradeModule
      ],
      providers: [
        ClassroomStatusService,
        CopyComponentService,
        InsertComponentService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    }).compileComponents();
    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          current: {
            name: ''
          },
          go: (route: string, params: any) => {},
          newComponents: []
        };
      }
    };
    spyOn(document, 'getElementById').and.returnValue(document.createElement('div'));
    fixture = TestBed.createComponent(NodeAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
