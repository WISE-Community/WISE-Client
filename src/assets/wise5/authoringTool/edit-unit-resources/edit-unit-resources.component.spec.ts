import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUnitResourcesComponent } from './edit-unit-resources.component';
import { MockProvider } from 'ng-mocks';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { By } from '@angular/platform-browser';

let component: EditUnitResourcesComponent;
let fixture: ComponentFixture<EditUnitResourcesComponent>;
describe('EditUnitResourcesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUnitResourcesComponent],
      providers: [MockProvider(TeacherProjectService)]
    }).compileComponents();

    fixture = TestBed.createComponent(EditUnitResourcesComponent);
    component = fixture.componentInstance;
    component.resources = [
      { name: 'Resource 1', url: 'http://example.com/resource1' },
      { name: 'Resource 2', url: 'http://example.com/resource2' }
    ];
    fixture.detectChanges();
  });

  it('should show the correct number of resources', () => {
    const resourceElements = fixture.debugElement.queryAll(By.css('input'));
    expect(resourceElements.length).toBe(2);
    expect(resourceElements[0].nativeElement.value).toContain('Resource 1');
    expect(resourceElements[1].nativeElement.value).toContain('Resource 2');
  });

  clickTopAddButton_addNewResourceAtTheBeginning();
  clickBottomTopButton_addNewResourceAtTheEnd();
});

function clickTopAddButton_addNewResourceAtTheBeginning() {
  describe('Clicking on the top Add Resource button', () => {
    let initialLength = 0;
    beforeEach(() => {
      initialLength = component.resources.length;
      fixture.debugElement.queryAll(By.css('button'))[0].nativeElement.click();
      fixture.detectChanges();
    });
    it('should add a new resource to the beginning of the list', () => {
      expect(component.resources.length).toBe(initialLength + 1);
      expect(component.resources[0].name).toEqual('');
      expect(component.resources[0].url).toEqual('');
    });
  });
}

function clickBottomTopButton_addNewResourceAtTheEnd() {
  describe('Clicking on the bottom Add Resource button', () => {
    let initialLength = 0;
    beforeEach(() => {
      initialLength = component.resources.length;
      const allButtons = fixture.debugElement.queryAll(By.css('button'));
      allButtons[allButtons.length - 1].nativeElement.click();
      fixture.detectChanges();
    });
    it('should add a new resource to the end of the list', () => {
      expect(component.resources.length).toBe(initialLength + 1);
      expect(component.resources.at(-1).name).toEqual('');
      expect(component.resources.at(-1).url).toEqual('');
    });
  });
}
