import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CRaterItemSelectComponent } from './crater-item-select.component';
import { MockProviders } from 'ng-mocks';
import { CRaterService } from '../../../../services/cRaterService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { Observable } from 'rxjs';

let loader: HarnessLoader;
describe('CRaterItemSelectComponent', () => {
  let component: CRaterItemSelectComponent;
  let fixture: ComponentFixture<CRaterItemSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CRaterItemSelectComponent],
      providers: [MockProviders(CRaterService, TeacherProjectService)]
    }).compileComponents();

    fixture = TestBed.createComponent(CRaterItemSelectComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.componentContent = { itemId: 'berkeley_HeLa', type: 'DialogGuidance' };
    fixture.detectChanges();
  });

  it('should show selected item id', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    expect(await select.getValueText()).toBe('berkeley_HeLa');
  });

  it('should get rubric and update component when item id is changed', async () => {
    const cRaterService = TestBed.inject(CRaterService);
    const rubricSpy = spyOn(cRaterService, 'makeCRaterVerifyRequest').and.returnValue(
      new Observable<any>((observer) => {
        observer.next({
          rubric: {
            description: 'Test description',
            ideas: [
              { name: '1', text: 'Idea 1 text' },
              { name: '2', text: 'Idea 2 text' }
            ]
          }
        });
        observer.complete();
      })
    );
    const saveSpy = spyOn(TestBed.inject(TeacherProjectService), 'saveProject');
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    await options[0].click(); // Select the first item (berkeley_BowlsInAFridge)
    expect(rubricSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
    expect(component.componentContent.itemId).toEqual('berkeley_BowlsInAFridge');
    expect(component.componentContent.cRaterRubric).toEqual({
      description: 'Test description',
      ideas: [
        { name: '1', text: 'Idea 1 text' },
        { name: '2', text: 'Idea 2 text' }
      ]
    });
  });
});
