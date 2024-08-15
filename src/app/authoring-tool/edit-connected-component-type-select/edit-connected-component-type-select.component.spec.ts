import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { ProjectService } from '../../../assets/wise5/services/projectService';
import { SessionService } from '../../../assets/wise5/services/sessionService';
import { EditConnectedComponentTypeSelectComponent } from './edit-connected-component-type-select.component';
import { createConnectedComponentObject } from '../../../app/authoring-tool/edit-connected-components/edit-connected-components.component.spec';

describe('EditConnectedComponentTypeSelectComponent', () => {
  let component: EditConnectedComponentTypeSelectComponent;
  let fixture: ComponentFixture<EditConnectedComponentTypeSelectComponent>;
  const componentId1 = 'componentId1';
  const nodeId1 = 'nodeId1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [EditConnectedComponentTypeSelectComponent],
    imports: [BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule],
    providers: [ConfigService, ProjectService, SessionService, provideHttpClient(withInterceptorsFromDi())]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConnectedComponentTypeSelectComponent);
    component = fixture.componentInstance;
    component.connectedComponent = createConnectedComponentObject(nodeId1, componentId1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
