import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditComponentAdvancedComponent } from './edit-component-advanced.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ComponentAuthoringModule } from '../../teacher/component-authoring.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentTeacherCommonServicesModule } from '../../student-teacher-common-services.module';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';

let component: EditComponentAdvancedComponent;
let fixture: ComponentFixture<EditComponentAdvancedComponent>;

describe('EditComponentAdvancedComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditComponentAdvancedComponent],
      imports: [ComponentAuthoringModule, HttpClientTestingModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            content: { type: 'ShowMyWork' },
            id: 'component1',
            nodeId: 'node1'
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {}
          }
        },
        StudentTeacherCommonServicesModule,
        TeacherProjectService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponentAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
