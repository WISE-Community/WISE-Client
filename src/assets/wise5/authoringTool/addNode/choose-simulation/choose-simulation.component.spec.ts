import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseSimulationComponent } from './choose-simulation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDividerModule } from '@angular/material/divider';
import { CopyNodesService } from '../../../services/copyNodesService';
import { InsertNodesService } from '../../../services/insertNodesService';

describe('ChooseSimulationComponent', () => {
  let component: ChooseSimulationComponent;
  let fixture: ComponentFixture<ChooseSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseSimulationComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        RouterTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [CopyNodesService, InsertNodesService, TeacherProjectService]
    }).compileComponents();
    fixture = TestBed.createComponent(ChooseSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
