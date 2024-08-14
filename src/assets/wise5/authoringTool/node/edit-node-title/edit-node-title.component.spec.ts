import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNodeTitleComponent } from './edit-node-title.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { Node } from '../../../common/Node';
import { provideAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { TeacherProjectTranslationService } from '../../../services/teacherProjectTranslationService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';

let component: EditNodeTitleComponent;
let fixture: ComponentFixture<EditNodeTitleComponent>;
let teacherProjectService: TeacherProjectService;

describe('EditNodeTitleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditNodeTitleComponent,
        HttpClientTestingModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [provideAnimations(), TeacherProjectService, TeacherProjectTranslationService]
    });
    teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'getLocale').and.returnValue(
      new ProjectLocale({ default: 'en_us', supported: ['es', 'ja'] })
    );
    spyOn(teacherProjectService, 'isDefaultLocale').and.returnValue(true);
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
  it('shows step position and title', () => {
    expect(fixture.debugElement.query(By.css('mat-label')).nativeElement.textContent).toContain(
      'Step Title 1.1'
    );
    expect(fixture.debugElement.query(By.css('input')).nativeElement.value).toContain('First step');
  });
});
