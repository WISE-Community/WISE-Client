import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditProjectLanguageSettingComponent } from './edit-project-language-setting.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { FormsModule } from '@angular/forms';

class MockTeacherProjectService {
  getLocale() {}
  saveProject() {}
}
describe('EditProjectLanguageSettingComponent', () => {
  let component: EditProjectLanguageSettingComponent;
  let fixture: ComponentFixture<EditProjectLanguageSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProjectLanguageSettingComponent],
      imports: [FormsModule, NgSelectModule],
      providers: [{ provide: TeacherProjectService, useClass: MockTeacherProjectService }]
    });
    fixture = TestBed.createComponent(EditProjectLanguageSettingComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getLocale').and.returnValue(new ProjectLocale());
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });
});
