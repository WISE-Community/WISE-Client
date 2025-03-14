import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentWorkgroupItemComponent } from './component-workgroup-item.component';
import { MockProvider } from 'ng-mocks';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { By } from '@angular/platform-browser';

let component: ComponentWorkgroupItemComponent;
let fixture: ComponentFixture<ComponentWorkgroupItemComponent>;
describe('ComponentWorkgroupItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentWorkgroupItemComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentWorkgroupItemComponent);
    component = fixture.componentInstance;
    component.workgroupId = 1;
    component.workgroupData = {};
    fixture.detectChanges();
  });

  clickOnButton_EmitOnUpdatedEvent();
});

function clickOnButton_EmitOnUpdatedEvent() {
  describe('click on button', () => {
    it('should emit onUpdateExpand event', () => {
      const spy = spyOn(component.onUpdateExpand, 'emit');
      fixture.debugElement.query(By.css('button')).nativeElement.click();
      expect(spy).toHaveBeenCalledWith({ workgroupId: 1, value: true });
    });
  });
}
