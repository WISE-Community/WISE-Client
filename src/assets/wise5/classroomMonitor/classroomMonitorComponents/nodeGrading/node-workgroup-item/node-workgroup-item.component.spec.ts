import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeWorkgroupItemComponent } from './node-workgroup-item.component';
import { MockProvider, MockProviders } from 'ng-mocks';
import { AnnotationService } from '../../../../services/annotationService';
import { ComponentTypeService } from '../../../../services/componentTypeService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { Node } from '../../../../common/Node';
import { Annotation } from '../../../../common/Annotation';
import { of } from 'rxjs';

describe('NodeWorkgroupItemComponent', () => {
  let component: NodeWorkgroupItemComponent;
  let fixture: ComponentFixture<NodeWorkgroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeWorkgroupItemComponent],
      providers: [
        MockProvider(AnnotationService, {
          annotationReceived$: of({} as Annotation)
        }),
        MockProviders(ComponentTypeService, TeacherProjectService)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NodeWorkgroupItemComponent);
    component = fixture.componentInstance;
    component.node = { id: 'node1' } as Node;
    component.components = [];
    component.workgroup = { workgroupId: 1, nodeStatus: { componentStatus: {} } };
    fixture.detectChanges();
  });

  it('should show team 1 with status', () => {
    expect(component).toBeTruthy();
    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Team 1');
    expect(textContent).toContain('Not Visited');
  });
});
