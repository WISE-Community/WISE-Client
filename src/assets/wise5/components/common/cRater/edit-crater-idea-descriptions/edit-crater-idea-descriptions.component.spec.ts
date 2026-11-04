import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CRaterIdea } from '../CRaterIdea';
import { EditCRaterIdeaDescriptionsComponent } from './edit-crater-idea-descriptions.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

class MockTeacherProjectService {
  nodeChanged() {}
}

describe('EditCRaterIdeaDescriptionsComponent', () => {
  let component: EditCRaterIdeaDescriptionsComponent;
  let fixture: ComponentFixture<EditCRaterIdeaDescriptionsComponent>;
  let nodeChangedSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCRaterIdeaDescriptionsComponent],
      providers: [{ provide: TeacherProjectService, useClass: MockTeacherProjectService }]
    }).compileComponents();
    nodeChangedSpy = spyOn(TestBed.inject(TeacherProjectService), 'nodeChanged');
    fixture = TestBed.createComponent(EditCRaterIdeaDescriptionsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ideaDescriptions', [new CRaterIdea('1', false, 'Idea 1')]);
    fixture.detectChanges();
  });

  it('should initialize sampleResponses with an empty string when idea has none', () => {
    expect(component.ideaDescriptions[0].sampleResponses).toEqual(['']);
    const labels = Array.from(fixture.nativeElement.querySelectorAll('mat-label')).map(
      (el: HTMLElement) => el.textContent.trim()
    );
    expect(labels).toContain('Sample Response');
  });

  it('should initialize sampleResponses when ideaDescriptions input changes', () => {
    fixture.componentRef.setInput('ideaDescriptions', [
      new CRaterIdea('1', false, 'Idea 1'),
      new CRaterIdea('2', false, 'Idea 2', [], '', ['Existing sample 1', 'Existing sample 2'])
    ]);
    fixture.detectChanges();
    expect(component.ideaDescriptions[0].sampleResponses).toEqual(['']);
    expect(component.ideaDescriptions[1].sampleResponses).toEqual([
      'Existing sample 1',
      'Existing sample 2'
    ]);
  });

  it('should add a new sample response to idea', () => {
    component['addNewSampleResponse'](component.ideaDescriptions[0]);
    fixture.detectChanges();
    expect(component.ideaDescriptions[0].sampleResponses).toEqual(['', '']);
    expect(nodeChangedSpy).toHaveBeenCalled();
  });

  it('should delete sample response when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const idea = new CRaterIdea('1', false, 'Idea 1', [], '', ['Sample 1', 'Sample 2']);
    component.ideaDescriptions = [idea];
    fixture.detectChanges();

    component['deleteSampleResponse'](idea, 0);
    expect(idea.sampleResponses).toEqual(['Sample 2']);
    expect(nodeChangedSpy).toHaveBeenCalled();
  });
});
