import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { WiseLinkComponent } from '../../../../directives/wise-link/wise-link.component';
import { AnnotationService } from '../../../../services/annotationService';
import { ConfigService } from '../../../../services/configService';
import { NotebookService } from '../../../../services/notebookService';
import { ProjectService } from '../../../../services/projectService';
import { SessionService } from '../../../../services/sessionService';
import { StudentAssetService } from '../../../../services/studentAssetService';
import { StudentDataService } from '../../../../services/studentDataService';
import { TagService } from '../../../../services/tagService';
import { UtilService } from '../../../../services/utilService';

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
        UpgradeModule
      ],
      declarations: [EditNotebookItemDialogComponent, WiseLinkComponent],
      providers: [
        AnnotationService,
        ConfigService,
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
        NotebookService,
        ProjectService,
        SessionService,
        StudentAssetService,
        StudentDataService,
        TagService,
        UtilService
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

  it(
    'should close dialog after save',
    waitForAsync(() => {
      const dialogRefCloseSpy = spyOn(TestBed.inject(MatDialogRef), 'close');
      component.data.saveNotebookItem = () => {
        return Promise.resolve({});
      };
      component.save().then(() => {
        expect(dialogRefCloseSpy).toHaveBeenCalled();
      });
    })
  );
});
