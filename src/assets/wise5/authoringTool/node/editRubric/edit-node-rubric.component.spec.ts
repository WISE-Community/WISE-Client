import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNodeRubricComponent } from './edit-node-rubric.component';
import { ConfigService } from '../../../services/configService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TeacherDataService } from '../../../services/teacherDataService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { TeacherWebSocketService } from '../../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let component: EditNodeRubricComponent;
let fixture: ComponentFixture<EditNodeRubricComponent>;
const node1: any = { rubric: '' };
const nodeId1: string = 'node1';

describe('EditNodeRubricComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditNodeRubricComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatDialogModule,
        MatIconModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule],
    providers: [
        ClassroomStatusService,
        ConfigService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService,
        {
            provide: ActivatedRoute,
            useValue: {
                parent: { parent: { params: of({ nodeId: 'node1' }) } }
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNodeRubricComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherDataService), 'getCurrentNodeId').and.returnValue(nodeId1);
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue(node1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
