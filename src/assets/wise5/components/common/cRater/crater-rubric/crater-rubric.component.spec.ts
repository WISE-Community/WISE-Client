import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CRaterRubricComponent } from './crater-rubric.component';
import { MockProvider } from 'ng-mocks';
import { CRaterRubric } from '../CRaterRubric';
import { CRaterIdea } from '../CRaterIdea';

describe('LibraryProjectDetailsComponent', () => {
  let component: CRaterRubricComponent;
  let fixture: ComponentFixture<CRaterRubricComponent>;
  let closeDialogSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CRaterRubricComponent],
      providers: [MockProvider(MatDialogRef), { provide: MAT_DIALOG_DATA, useValue: {} }]
    });

    fixture = TestBed.createComponent(CRaterRubricComponent);
    component = fixture.componentInstance;
    component['rubric'] = new CRaterRubric();
    fixture.detectChanges();
  });

  it('should close dialog when X is clicked', () => {
    closeDialogSpy = spyOn(component['dialogRef'], 'close');
    fixture.nativeElement.querySelector('button').click();
    expect(closeDialogSpy).toHaveBeenCalled();
  });

  it('should show description if one exists', () => {
    expect(fixture.nativeElement.querySelectorAll('p').length).toEqual(0);
    component['rubric'].description = 'Test';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('p').length).toEqual(1);
  });

  it('should not show description if none exists', () => {
    expect(fixture.nativeElement.querySelectorAll('p').length).toEqual(0);
    component['rubric'].description = '';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('p').length).toEqual(0);
  });

  it('should show idea text', () => {
    component['rubric'] = new CRaterRubric({
      description: '',
      ideas: [new CRaterIdea('1', undefined, 'First idea'), new CRaterIdea('2', undefined, 'Second idea')]
    });
    component.ngOnInit();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toEqual(2);
    expect(rows[0].textContent.trim()).toEqual('First idea');
    expect(rows[1].textContent.trim()).toEqual('Second idea');
  });
});
