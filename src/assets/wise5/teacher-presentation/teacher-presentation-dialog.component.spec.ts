import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeacherPresentationDialogComponent } from './teacher-presentation-dialog.component';
import { TeacherPresentationSelectionStore } from './teacher-presentation-selection.store';
import { TeacherPresentationConfigService } from './teacher-presentation-config.service';
import { ConfigService } from '../services/configService';
import { MockProvider } from 'ng-mocks';
import { CRaterService } from '../services/cRaterService';

describe('TeacherPresentationDialogComponent', () => {
  let component: TeacherPresentationDialogComponent;
  let fixture: ComponentFixture<TeacherPresentationDialogComponent>;
  let store: TeacherPresentationSelectionStore;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TeacherPresentationDialogComponent>>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let presentationConfigServiceSpy: jasmine.SpyObj<TeacherPresentationConfigService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    configServiceSpy = jasmine.createSpyObj('ConfigService', [
      'getRunId',
      'getPeriods',
      'getClassmateUserInfos'
    ]);
    presentationConfigServiceSpy = jasmine.createSpyObj('TeacherPresentationConfigService', [
      'getConfig',
      'saveConfig'
    ]);

    await TestBed.configureTestingModule({
      imports: [TeacherPresentationDialogComponent],
      providers: [
        TeacherPresentationSelectionStore,
        MockProvider(CRaterService),
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
            periodId: 1,
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

  it('should allow presentation prompt to be an empty string', () => {
    store.prompt.set('');
    expect(component.effectivePrompt).toBe('');
    expect(component.isSavedPromptDifferentFromDefault).toBeTrue();
  });

  it('should allow editing prompt and saving to store', () => {
    component.startEditPrompt();
    component['editedPrompt'] = 'Newly edited prompt';
    spyOn(store, 'setPrompt');

    component.savePrompt();

    expect(store.setPrompt).toHaveBeenCalledWith('Newly edited prompt');
    expect(component['isEditingPrompt']).toBeFalse();
  });

  it('should allow saving an empty string prompt to store', () => {
    component.startEditPrompt();
    component['editedPrompt'] = '   ';
    spyOn(store, 'setPrompt');

    component.savePrompt();

    expect(store.setPrompt).toHaveBeenCalledWith('');
    expect(component['isEditingPrompt']).toBeFalse();
  });

  it('should save prompt when Enter key is pressed in textarea', () => {
    component.startEditPrompt();
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea).toBeTruthy();

    component['editedPrompt'] = 'Prompt via Enter key';
    spyOn(component, 'savePrompt').and.callThrough();
    spyOn(store, 'setPrompt');

    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      cancelable: true
    });
    textarea.dispatchEvent(event);

    expect(component.savePrompt).toHaveBeenCalled();
    expect(store.setPrompt).toHaveBeenCalledWith('Prompt via Enter key');
    expect(component['isEditingPrompt']).toBeFalse();
    expect(event.defaultPrevented).toBeTrue();
  });

  it('should cancel prompt editing', () => {
    component.startEditPrompt();
    expect(component['isEditingPrompt']).toBeTrue();

    component.cancelEditPrompt();
    expect(component['isEditingPrompt']).toBeFalse();
  });

  it('should allow resetting prompt to default', () => {
    store.prompt.set('Custom override');
    spyOn(store, 'setPrompt');

    component.resetPromptToDefault();

    expect(store.setPrompt).toHaveBeenCalledWith(null);
    expect(component['isEditingPrompt']).toBeFalse();
  });

  it('should determine whether saved prompt matches default prompt', () => {
    // Initially store prompt is null, so effectivePrompt matches default prompt
    expect(component.isSavedPromptDifferentFromDefault).toBeFalse();

    // When store prompt has a custom value different from default prompt
    store.prompt.set('Customized prompt text');
    expect(component.isSavedPromptDifferentFromDefault).toBeTrue();

    // When store prompt has text matching default prompt
    store.prompt.set('Component default prompt');
    expect(component.isSavedPromptDifferentFromDefault).toBeFalse();
  });

  it('should update studentNamesDisplay mode in store when names display changed', () => {
    spyOn(store, 'setStudentNamesDisplay');

    component.onNamesDisplayChange('anonymize');
    expect(store.setStudentNamesDisplay).toHaveBeenCalledWith('anonymize');

    component.onNamesDisplayChange('show');
    expect(store.setStudentNamesDisplay).toHaveBeenCalledWith('show');
  });

  it('should toggle hideControls when toggleControls is called', () => {
    expect(component['hideControls']).toBeFalse();

    component.toggleControls(false);
    expect(component['hideControls']).toBeTrue();

    component.toggleControls(true);
    expect(component['hideControls']).toBeFalse();

    component.toggleControls();
    expect(component['hideControls']).toBeTrue();
  });

  it('should set isEditingPrompt to false when hiding controls via toggleControls', () => {
    component.startEditPrompt();
    fixture.detectChanges();
    expect(component['isEditingPrompt']).toBeTrue();

    component.toggleControls(false); // hide controls
    expect(component['hideControls']).toBeTrue();
    expect(component['isEditingPrompt']).toBeFalse();
  });

  it('should disable toggle controls button when editing prompt and textarea is dirty', () => {
    component.startEditPrompt();
    fixture.detectChanges();

    // Pristine: toggle controls button is NOT disabled
    const toggleButton = fixture.nativeElement.querySelector('mat-button-toggle');
    expect(component.isPromptDirty).toBeFalse();
    expect(
      toggleButton.classList.contains('mat-button-toggle-disabled') ||
        toggleButton.querySelector('button[disabled]') != null ||
        toggleButton.attributes.getNamedItem('ng-reflect-disabled')?.value === 'true'
    ).toBeFalse();

    // Dirty: toggle controls button IS disabled
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'Changed prompt text';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.isPromptDirty).toBeTrue();
    expect(
      toggleButton.classList.contains('mat-button-toggle-disabled') ||
        toggleButton.querySelector('button[disabled]') != null ||
        toggleButton.attributes.getNamedItem('ng-reflect-disabled')?.value === 'true'
    ).toBeTrue();
  });

  it('should show placeholder text when prompt is empty and controls are shown', () => {
    store.prompt.set('');
    component.toggleControls(true); // controls shown: hideControls = false
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('[Add optional presentation prompt]');

    component.toggleControls(false); // controls hidden: hideControls = true
    fixture.detectChanges();

    expect(compiled.textContent).not.toContain('[Add optional presentation prompt]');
  });

  it('should close dialog when close() is called', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });

  it('should return component prompt from component content', () => {
    expect(component.componentPrompt).toBeNull();

    component.data.component = {
      id: 'comp1',
      type: 'OpenResponse',
      prompt: 'What do you think happens to the energy?'
    } as any;
    expect(component.componentPrompt).toBe('What do you think happens to the energy?');
  });

  it('should use default Ideas prompt when type is Ideas and no authoring prompt is provided', () => {
    component.data.component = {
      id: 'comp1',
      type: 'OpenResponse',
      content: {}
    } as any;
    store.type.set('Ideas');
    store.prompt.set(null);

    expect(component.effectivePrompt).toBe(
      "Here are your classmates' ideas. Which ideas do you agree with or want to explore further?"
    );
  });

  it('should render ideas-presentation when type is Ideas and hasSelections is true', () => {
    store.type.set('Ideas');
    store.selectedIdeaIds.set(new Set(['idea_1']));
    fixture.detectChanges();

    const ideasEl = fixture.nativeElement.querySelector('ideas-presentation');
    expect(ideasEl).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('No posts selected');
    expect(fixture.nativeElement.textContent).not.toContain('No ideas selected');
  });

  it('should render Ideas empty state when type is Ideas and hasSelections is false', () => {
    store.type.set('Ideas');
    store.selectedIdeaIds.set(new Set());
    store.standaloneResponses.set(new Map());
    fixture.detectChanges();

    const ideasEl = fixture.nativeElement.querySelector('ideas-presentation');
    expect(ideasEl).toBeNull();
    expect(fixture.nativeElement.textContent).toContain(
      'No ideas selected. Close and check ideas to display.'
    );
  });

  it('should default componentPromptDisplay to show', () => {
    expect(component.componentPromptDisplay).toBe('show');
  });

  it('should update componentPromptDisplay when onComponentPromptDisplayChange is called', () => {
    spyOn(store, 'setShowComponentPrompt').and.callThrough();

    component.onComponentPromptDisplayChange('hide');
    expect(store.setShowComponentPrompt).toHaveBeenCalledWith(false);
    expect(component.componentPromptDisplay).toBe('hide');

    component.onComponentPromptDisplayChange('show');
    expect(store.setShowComponentPrompt).toHaveBeenCalledWith(true);
    expect(component.componentPromptDisplay).toBe('show');
  });

  it('should render original question section when prompt exists and componentPromptDisplay is show', () => {
    component.data.component = {
      id: 'comp1',
      type: 'OpenResponse',
      prompt: 'Why does ice float?'
    } as any;
    store.showComponentPrompt.set(true);
    fixture.detectChanges();

    const promptSection = fixture.nativeElement.querySelector('.component-prompt-section');
    expect(promptSection).not.toBeNull();
    expect(promptSection.textContent).toContain('Why does ice float?');
  });

  it('should hide original question section when componentPromptDisplay is hide', () => {
    component.data.component = {
      id: 'comp1',
      type: 'OpenResponse',
      prompt: 'Why does ice float?'
    } as any;
    store.showComponentPrompt.set(false);
    fixture.detectChanges();

    const promptSection = fixture.nativeElement.querySelector('.component-prompt-section');
    expect(promptSection).toBeNull();
  });

  it('should render Original Question dropdown in header when controls are visible', () => {
    component.toggleControls(true); // controls visible
    fixture.detectChanges();

    const selects = fixture.nativeElement.querySelectorAll('mat-select');
    // There should be both Student Names and Original Question selects
    expect(selects.length).toBe(2);
    expect(selects[1].getAttribute('aria-label')).toBe('Activity Question Display');
  });
});
