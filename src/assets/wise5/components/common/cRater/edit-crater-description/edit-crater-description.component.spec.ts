import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EditCRaterDescriptionComponent } from './edit-crater-description.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';

class MockTeacherProjectService {
  nodeChanged() {}
}

describe('EditCRaterDescriptionComponent', () => {
  let component: EditCRaterDescriptionComponent;
  let fixture: ComponentFixture<EditCRaterDescriptionComponent>;
  let nodeChangedSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCRaterDescriptionComponent],
      providers: [{ provide: TeacherProjectService, useClass: MockTeacherProjectService }]
    }).compileComponents();
    nodeChangedSpy = spyOn(TestBed.inject(TeacherProjectService), 'nodeChanged');
    fixture = TestBed.createComponent(EditCRaterDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should save changes to JSON', fakeAsync(() => {
    const textarea = fixture.nativeElement.querySelector('textarea');
    textarea.value = 'Testing';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    fixture.whenStable().then(() => {
      expect(nodeChangedSpy).toHaveBeenCalled();
      expect(component.cRaterRubric.description).toEqual('Testing');
    });
  }));

  it('should populate the input field with JSON data', fakeAsync(() => {
    component.cRaterRubric.description = 'Test';
    fixture.detectChanges();
    tick();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('textarea').value).toEqual('Test');
    });
  }));
});
