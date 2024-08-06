import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeAdvancedAuthoringComponent } from './node-advanced-authoring.component';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NodeAdvancedAuthoringComponent', () => {
  let component: NodeAdvancedAuthoringComponent;
  let fixture: ComponentFixture<NodeAdvancedAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [NodeAdvancedAuthoringComponent],
    imports: [MatIconModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule],
    providers: [
        TeacherProjectService,
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: { paramMap: convertToParamMap({ nodeId: 'node1' }) },
                parent: { params: of({ unitId: 1 }) }
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
    fixture = TestBed.createComponent(NodeAdvancedAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
