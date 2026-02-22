import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditComponentComponent } from './edit-component.component';
import { Component } from '@angular/core';
import { components } from '../../../components/Components';
import { ComponentContent } from '../../../common/ComponentContent';

@Component({
  template: '<div>Mock Authoring Component</div>'
})
class MockAuthoringComponent {
  componentContent: any;
  nodeId: string;
}

describe('EditComponentComponent', () => {
  let component: EditComponentComponent;
  let fixture: ComponentFixture<EditComponentComponent>;
  const mockComponentContent = {
    type: 'mockComponent'
  };
  const mockNodeId = 'node1';

  beforeEach(async () => {
    components['mockComponent'] = {
      authoring: MockAuthoringComponent
    };

    await TestBed.configureTestingModule({
      imports: [EditComponentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponentComponent);
    component = fixture.componentInstance;
    component.componentContent = mockComponentContent as ComponentContent;
    component.nodeId = mockNodeId;
    fixture.detectChanges();
  });

  it('should create the dynamic component after view init', () => {
    component.ngAfterViewInit();
    fixture.detectChanges();
    const componentElement = fixture.nativeElement.querySelector('div');
    expect(componentElement.textContent).toContain('Mock Authoring Component');
  });

  it('should pass inputs to the dynamic component', () => {
    component.ngAfterViewInit();
    fixture.detectChanges();
    const componentInstance = (component as any).componentRef.instance;
    expect(componentInstance.componentContent).toBe(mockComponentContent);
    expect(componentInstance.nodeId).toBe(mockNodeId);
  });

  it('should destroy the component reference on destroy', () => {
    component.ngAfterViewInit();
    const destroySpy = spyOn((component as any).componentRef, 'destroy');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should focus the host element after timeout', (done) => {
    component.ngAfterViewInit();
    fixture.detectChanges();
    setTimeout(() => {
      const hostElement = fixture.nativeElement.querySelector('div');
      expect(document.activeElement).toBe(hostElement);
      done();
    }, 0);
  });
});
