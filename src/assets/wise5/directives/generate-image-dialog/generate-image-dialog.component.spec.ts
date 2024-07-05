import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { ComponentContent } from '../../common/ComponentContent';
import { ProjectService } from '../../services/projectService';
import { GenerateImageDialogComponent } from './generate-image-dialog.component';

describe('GenerateImageDialogComponent', () => {
  let component: GenerateImageDialogComponent;
  let fixture: ComponentFixture<GenerateImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        GenerateImageDialogComponent,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close() {} } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateImageDialogComponent);
    const projectService = TestBed.inject(ProjectService);
    projectService.project = {};
    spyOn(projectService, 'getComponent').and.returnValue({
      type: 'OutsideURL'
    } as ComponentContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
