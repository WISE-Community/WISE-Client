import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseSimulationComponent } from './choose-simulation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpgradeModule } from '@angular/upgrade/static';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        StudentTeacherCommonServicesModule,
        UpgradeModule
      ],
      providers: [TeacherProjectService]
    }).compileComponents();

    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          go: (route: string, params: any) => {}
        };
      }
    };
    TestBed.inject(TeacherProjectService);
    fixture = TestBed.createComponent(ChooseSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
