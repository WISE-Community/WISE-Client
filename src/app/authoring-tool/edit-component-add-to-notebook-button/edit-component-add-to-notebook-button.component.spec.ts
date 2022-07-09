import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ComponentServiceLookupServiceModule } from '../../../assets/wise5/services/componentServiceLookupServiceModule';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { SessionService } from '../../../assets/wise5/services/sessionService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { UtilService } from '../../../assets/wise5/services/utilService';

import { EditComponentAddToNotebookButtonComponent } from './edit-component-add-to-notebook-button.component';

describe('EditComponentAddToNotebookButtonComponent', () => {
  let component: EditComponentAddToNotebookButtonComponent;
  let fixture: ComponentFixture<EditComponentAddToNotebookButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComponentServiceLookupServiceModule,
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule
      ],
      declarations: [EditComponentAddToNotebookButtonComponent],
      providers: [ConfigService, SessionService, TeacherProjectService, UtilService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentAddToNotebookButtonComponent);
    component = fixture.componentInstance;
    component.authoringComponentContent = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
