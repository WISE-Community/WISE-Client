import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseSimulationComponent } from './choose-simulation.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDividerModule } from '@angular/material/divider';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertNodesService } from '../../../services/insertNodesService';
import { InsertFirstNodeInBranchPathService } from '../../../services/insertFirstNodeInBranchPathService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChooseSimulationComponent', () => {
  let component: ChooseSimulationComponent;
  let fixture: ComponentFixture<ChooseSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseSimulationComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        CopyNodesService,
        InsertFirstNodeInBranchPathService,
        InsertNodesService,
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
    window.history.pushState({}, '', '');
    fixture = TestBed.createComponent(ChooseSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
