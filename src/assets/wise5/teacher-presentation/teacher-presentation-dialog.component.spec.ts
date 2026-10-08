import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TeacherPresentationDialogComponent } from './teacher-presentation-dialog.component';
import { TeacherPresentationSelectionStore } from './teacher-presentation-selection.store';
import { TeacherPresentationConfigService } from './teacher-presentation-config.service';
import { ConfigService } from '../services/configService';

describe('TeacherPresentationDialogComponent', () => {
  let component: TeacherPresentationDialogComponent;
  let fixture: ComponentFixture<TeacherPresentationDialogComponent>;
  let store: TeacherPresentationSelectionStore;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TeacherPresentationDialogComponent>>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let presentationConfigServiceSpy: jasmine.SpyObj<TeacherPresentationConfigService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    configServiceSpy = jasmine.createSpyObj('ConfigService', ['getRunId', 'getPeriods']);
    presentationConfigServiceSpy = jasmine.createSpyObj('TeacherPresentationConfigService', [
      'getConfig',
      'saveConfig'
    ]);

    await TestBed.configureTestingModule({
      imports: [TeacherPresentationDialogComponent, NoopAnimationsModule],
      providers: [
        TeacherPresentationSelectionStore,
        { provide: TeacherPresentationConfigService, useValue: presentationConfigServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useFactory: (s: TeacherPresentationSelectionStore) => ({
            nodeId: 'node1',
            component: {
              id: 'comp1',
              type: 'Discussion',
              content: {
                presentation: {
                  prompt: 'Component default prompt'
                }
              }
            },
            periodId: 10,
            periodName: 'Period 1',
            store: s
          }),
          deps: [TeacherPresentationSelectionStore]
        }
      ]
    }).compileComponents();

    store = TestBed.inject(TeacherPresentationSelectionStore);
    fixture = TestBed.createComponent(TeacherPresentationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display component default prompt if store prompt is null', () => {
    expect(component.effectivePrompt).toBe('Component default prompt');
  });

  it('should display store prompt if customized by teacher', () => {
    store.prompt.set('Custom teacher override prompt');
    expect(component.effectivePrompt).toBe('Custom teacher override prompt');
  });

  it('should allow editing prompt and saving to store', () => {
    component.startEditPrompt();
    component['editedPrompt'] = 'Newly edited prompt';
    spyOn(store, 'setPrompt');

    component.savePrompt();

    expect(store.setPrompt).toHaveBeenCalledWith('Newly edited prompt');
    expect(component['isEditingPrompt']).toBeFalse();
  });

  it('should allow resetting prompt to default', () => {
    store.prompt.set('Custom override');
    spyOn(store, 'setPrompt');

    component.resetPromptToDefault();

    expect(store.setPrompt).toHaveBeenCalledWith(null);
    expect(component['isEditingPrompt']).toBeFalse();
  });

  it('should update studentNamesDisplay mode in store when toggle changed', () => {
    spyOn(store, 'setStudentNamesDisplay');

    component.onNamesDisplayChange('anonymize');
    expect(store.setStudentNamesDisplay).toHaveBeenCalledWith('anonymize');

    component.onNamesDisplayChange('show');
    expect(store.setStudentNamesDisplay).toHaveBeenCalledWith('show');
  });

  it('should close dialog when close() is called', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });
});
