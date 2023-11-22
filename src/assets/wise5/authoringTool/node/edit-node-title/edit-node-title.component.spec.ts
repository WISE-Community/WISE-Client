import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNodeTitleComponent } from './edit-node-title.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Node } from '../../../common/Node';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { provideAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

class MockTeacherProjectService {
  getNodeById() {}
  getNodePositionById() {}
}
let component: EditNodeTitleComponent;
let fixture: ComponentFixture<EditNodeTitleComponent>;
describe('EditNodeTitleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditNodeTitleComponent],
      imports: [FormsModule, MatFormFieldModule, MatInputModule],
      providers: [
        { provide: TeacherProjectService, useClass: MockTeacherProjectService },
        provideAnimations()
      ]
    });
    fixture = TestBed.createComponent(EditNodeTitleComponent);
    component = fixture.componentInstance;
    const node = new Node();
    node.title = 'First step';
    component.node = node;
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue(node);
    spyOn(TestBed.inject(TeacherProjectService), 'getNodePositionById').and.returnValue('1.1');
    component.ngOnChanges();
    fixture.detectChanges();
  });
  it('should show step position and title', () => {
    expect(fixture.debugElement.query(By.css('mat-label')).nativeElement.textContent).toContain(
      'Step Title 1.1'
    );
    expect(fixture.debugElement.query(By.css('input')).nativeElement.value).toContain('First step');
  });
});
