import { TestBed } from '@angular/core/testing';
import { MockProvider, MockProviders } from 'ng-mocks';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { NotebookService } from '../../../assets/wise5/services/notebookService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { NotebookItemComponent } from './notebook-item.component';
import { of } from 'rxjs';

let component: NotebookItemComponent;
describe('NotebookItemComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotebookItemComponent],
      providers: [
        MockProviders(ConfigService, ProjectService),
        MockProvider(NotebookService, {
          notebookUpdated$: of({})
        })
      ]
    });
    const fixture = TestBed.createComponent(NotebookItemComponent);
    component = fixture.componentInstance;
    component.note = { type: 'note', content: { attachments: [] } };
    component.config = { itemTypes: { note: { label: 'note!' } } };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
