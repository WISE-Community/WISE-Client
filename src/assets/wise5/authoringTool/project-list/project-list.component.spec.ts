import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ConfigService } from '../../services/configService';
import { ProjectListComponent } from './project-list.component';
import { CopyProjectService } from '../../services/copyProjectService';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ProjectListComponent],
    imports: [MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule],
    providers: [{ provide: CopyProjectService, useValue: {} }, TeacherProjectService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    spyOn(TestBed.inject(ConfigService), 'getConfigParam').and.returnValue([]);
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
