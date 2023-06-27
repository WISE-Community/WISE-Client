import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentTeacherCommonServicesModule } from '../../../../../../app/student-teacher-common-services.module';
import { WiseLinkComponent } from '../../../../directives/wise-link/wise-link.component';
import { ProjectService } from '../../../../services/projectService';
import { EditNotebookItemDialogComponent } from './edit-notebook-item-dialog.component';

describe('EditNotebookItemDialogComponent', () => {
  let component: EditNotebookItemDialogComponent;
  let fixture: ComponentFixture<EditNotebookItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatToolbarModule,
        ReactiveFormsModule,
        StudentTeacherCommonServicesModule
      ],
      declarations: [EditNotebookItemDialogComponent, WiseLinkComponent],
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
        }
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
