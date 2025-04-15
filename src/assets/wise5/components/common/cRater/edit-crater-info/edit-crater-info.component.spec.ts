import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCRaterInfoComponent } from './edit-crater-info.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { CRaterRubric } from '../CRaterRubric';

class MockTeacherProjectService {
  nodeChanged() {}
}

describe('EditCRaterInfoComponent', () => {
  let component: EditCRaterInfoComponent;
  let fixture: ComponentFixture<EditCRaterInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCRaterInfoComponent],
      providers: [{ provide: TeacherProjectService, useClass: MockTeacherProjectService }]
    }).compileComponents();
    spyOn(TestBed.inject(TeacherProjectService), 'nodeChanged');

    fixture = TestBed.createComponent(EditCRaterInfoComponent);
    component = fixture.componentInstance;
    component.cRaterRubric = new CRaterRubric({ description: '', ideas: [] });
    fixture.detectChanges();
  });

  it('should have a description section and idea descriptions section', () => {
    expect(
      fixture.nativeElement.querySelectorAll('edit-crater-description').length
    ).toBeGreaterThan(0);
    expect(
      fixture.nativeElement.querySelectorAll('edit-crater-idea-descriptions').length
    ).toBeGreaterThan(0);
  });
});
