import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNodeRubricComponent } from './edit-node-rubric.component';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockComponent, MockProvider } from 'ng-mocks';
import { TranslatableRichTextEditorComponent } from '../../components/translatable-rich-text-editor/translatable-rich-text-editor.component';

let component: EditNodeRubricComponent;
let fixture: ComponentFixture<EditNodeRubricComponent>;
const node1: any = { rubric: '' };

describe('EditNodeRubricComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditNodeRubricComponent, MockComponent(TranslatableRichTextEditorComponent)],
      providers: [
        MockProvider(TeacherProjectService),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: { parent: { parent: { params: of({ nodeId: 'node1' }) } } }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNodeRubricComponent);
    component = fixture.componentInstance;
    spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.returnValue(node1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
