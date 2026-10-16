import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockProviders } from 'ng-mocks';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { AddLessonConfigureComponent } from './add-lesson-configure.component';

describe('AddLessonConfigureComponent', () => {
  let fixture: ComponentFixture<AddLessonConfigureComponent>;
  let projectService: TeacherProjectService;
  let titleInput: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLessonConfigureComponent],
      providers: [MockProviders(TeacherProjectService), provideRouter([])]
    }).compileComponents();
    window.history.pushState({ target: 'group1' }, '', '');
    projectService = TestBed.inject(TeacherProjectService);
    spyOn(projectService, 'createGroup').and.returnValue({ id: 'group2' });
    spyOn(projectService, 'checkPotentialStartNodeIdChangeThenSaveProject').and.returnValue(
      new Promise(() => {})
    );
    spyOn(HTMLElement.prototype, 'focus');
    fixture = TestBed.createComponent(AddLessonConfigureComponent);
    fixture.detectChanges();
    titleInput = fixture.nativeElement.querySelector('#title');
  });

  function typeTitle(title: string): void {
    titleInput.value = title;
    titleInput.dispatchEvent(new Event('input'));
  }

  function pressEnter(): void {
    const init = { key: 'Enter', keyCode: 13, bubbles: true } as KeyboardEventInit;
    titleInput.dispatchEvent(new KeyboardEvent('keydown', init));
    titleInput.dispatchEvent(new KeyboardEvent('keyup', init));
  }

  it('should add one lesson when Enter is pressed once', () => {
    typeTitle('Lesson');
    pressEnter();
    expect(projectService.createGroup).toHaveBeenCalledTimes(1);
  });

  it('should not add another lesson while the first save is still in flight', () => {
    typeTitle('Lesson');
    pressEnter();
    pressEnter();
    expect(projectService.createGroup).toHaveBeenCalledTimes(1);
  });

  it('should not add a lesson when Enter is pressed with an empty title', () => {
    pressEnter();
    expect(projectService.createGroup).not.toHaveBeenCalled();
  });
});
