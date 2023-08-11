import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ConfigService } from '../../services/configService';
import { ProjectListComponent } from './project-list.component';
import { CopyProjectService } from '../../services/copyProjectService';
import { UpgradeModule } from '@angular/upgrade/static';
import { MatIconModule } from '@angular/material/icon';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectListComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        { provide: CopyProjectService, useValue: {} },
        TeacherProjectService,
        UpgradeModule
      ]
    }).compileComponents();
    spyOn(TestBed.inject(ConfigService), 'getConfigParam').and.returnValue([]);
    TestBed.inject(UpgradeModule).$injector = {
      get: () => {
        return {
          go: (route: string, params: any) => {}
        };
      }
    };
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
