import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { EditComponentTeacherReflectionsComponent } from './edit-component-teacher-reflections.component';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { ComponentContent } from '../../../assets/wise5/common/ComponentContent';

describe('EditComponentTeacherReflectionsComponent', () => {
  let component: EditComponentTeacherReflectionsComponent;
  let fixture: ComponentFixture<EditComponentTeacherReflectionsComponent>;
  let mockProjectService: jasmine.SpyObj<TeacherProjectService>;

  beforeEach(async () => {
    mockProjectService = jasmine.createSpyObj('TeacherProjectService', ['nodeChanged']);

    await TestBed.configureTestingModule({
      imports: [EditComponentTeacherReflectionsComponent],
      providers: [
        provideNoopAnimations(),
        { provide: TeacherProjectService, useValue: mockProjectService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponentTeacherReflectionsComponent);
    component = fixture.componentInstance;
    component.componentContent = {
      id: 'comp1',
      type: 'Discussion'
    } as ComponentContent;
  });

  it('should create and initialize reflectionQuestions if missing', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.componentContent.teacher).toBeDefined();
    expect(component.componentContent.teacher.reflectionQuestions).toEqual([]);
  });

  it('should add a reflection question and notify node changed', () => {
    fixture.detectChanges();
    component.addReflectionQuestion();

    expect(component.componentContent.teacher.reflectionQuestions.length).toBe(1);
    expect(component.componentContent.teacher.reflectionQuestions[0].id).toBeTruthy();
    expect(component.componentContent.teacher.reflectionQuestions[0].text).toBe('');
    expect(mockProjectService.nodeChanged).toHaveBeenCalledTimes(1);
  });

  it('should delete a reflection question and notify node changed', () => {
    component.componentContent.teacher = {
      reflectionQuestions: [
        { id: 'q1', text: 'First question' },
        { id: 'q2', text: 'Second question' }
      ]
    };
    fixture.detectChanges();

    component.deleteReflectionQuestion(0);

    expect(component.componentContent.teacher.reflectionQuestions.length).toBe(1);
    expect(component.componentContent.teacher.reflectionQuestions[0].id).toBe('q2');
    expect(mockProjectService.nodeChanged).toHaveBeenCalledTimes(1);
  });

  it('should debounce question text changes', fakeAsync(() => {
    component.componentContent.teacher = {
      reflectionQuestions: [{ id: 'q1', text: 'Initial' }]
    };
    fixture.detectChanges();

    component.componentContent.teacher.reflectionQuestions[0].text = 'Typing 1';
    component['onQuestionTextChanged']();

    expect(mockProjectService.nodeChanged).not.toHaveBeenCalled();

    tick(500);
    component.componentContent.teacher.reflectionQuestions[0].text = 'Typing 2';
    component['onQuestionTextChanged']();

    tick(1000);
    expect(mockProjectService.nodeChanged).toHaveBeenCalledTimes(1);
  }));
});
