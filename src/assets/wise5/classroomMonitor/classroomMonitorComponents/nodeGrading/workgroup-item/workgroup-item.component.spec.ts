import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkgroupItemComponent } from './workgroup-item.component';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { MockProviders } from 'ng-mocks';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { By } from '@angular/platform-browser';

let component: WorkgroupItemComponent;
let fixture: ComponentFixture<WorkgroupItemComponent>;
let getComponentsSpy: jasmine.Spy;
let teacherProjectService: TeacherProjectService;
describe('WorkgroupItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkgroupItemComponent],
      providers: [MockProviders(ComponentTypeService, TeacherProjectService)]
    }).compileComponents();
  });

  beforeEach(() => {
    teacherProjectService = TestBed.inject(TeacherProjectService);
    spyOn(teacherProjectService, 'nodeHasWork').and.returnValue(true);
    getComponentsSpy = spyOn(teacherProjectService, 'getComponents');
    getComponentsSpy.and.returnValue([]);
    fixture = TestBed.createComponent(WorkgroupItemComponent);
    component = fixture.componentInstance;
    component.workgroupData = {
      nodeStatus: {}
    };
    fixture.detectChanges();
  });

  it('toggle expand button should be enabled', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBe(false);
  });
});
