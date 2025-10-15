import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { ProjectService } from '../../../../services/projectService';
import { EditNotebookItemDialogComponent } from './edit-notebook-item-dialog.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EditNotebookItemDialogComponent', () => {
  let component: EditNotebookItemDialogComponent;
  let fixture: ComponentFixture<EditNotebookItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNotebookItemDialogComponent, StudentTeacherCommonServicesModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            notebookConfig: {
              itemTypes: {
                note: {
                  label: {
                    color: 'white',
                    plural: 'notes',
                    singular: 'note'
                  }
                }
              }
            }
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {}
          }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotebookItemDialogComponent);
    spyOn(TestBed.inject(ProjectService), 'isSpaceExists').and.returnValue(false);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update', () => {
    expect(component.saveEnabled).toBeFalsy(false);
    component.item.content.text = 'Hello World';
    component.update();
    expect(component.saveEnabled).toBeTruthy(true);
  });

  it('should close dialog after save', (done) => {
    const dialogRefCloseSpy = spyOn(TestBed.inject(MatDialogRef), 'close');
    component.data.saveNotebookItem = () => {
      return Promise.resolve({});
    };
    component.save().then(() => {
      expect(dialogRefCloseSpy).toHaveBeenCalled();
      done();
    });
  });
});
