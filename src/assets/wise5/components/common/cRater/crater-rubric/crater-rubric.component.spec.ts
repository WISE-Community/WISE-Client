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
      ideas: [
        new CRaterIdea('1', undefined, 'First idea'),
        new CRaterIdea('2', undefined, 'Second idea')
      ]
    });
    component.ngOnInit();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toEqual(2);
    expect(rows[0].textContent.trim()).toEqual('First idea');
    expect(rows[1].textContent.trim()).toEqual('Second idea');
  });

  it('should display non-empty sample responses below idea text when toggled on', () => {
    setRubricWithSampleResponses();
    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers.length).toEqual(1);
    expect(headers[0].querySelector('span').textContent.trim()).toEqual('Ideas');
    expect(fixture.nativeElement.querySelectorAll('tbody tr:first-child td').length).toEqual(1);
    expect(getSampleResponseTexts()).toEqual([]);

    const toggle = fixture.nativeElement.querySelector('a[role="button"]');
    toggle.click();
    fixture.detectChanges();
    expect(getSampleResponseTexts()).toEqual(['"Sample response 1"']);
  });

  it('should not show sample responses toggle when rubric has no sample responses', () => {
    expect(fixture.nativeElement.querySelector('a[role="button"]')).toBeNull();
  });

  it('should toggle sample response visibility when link is clicked', () => {
    setRubricWithSampleResponses();
    const toggle = fixture.nativeElement.querySelector('a[role="button"]');
    expect(toggle.textContent.trim()).toEqual('Show sample responses');
    expect(getSampleResponseTexts()).toEqual([]);

    toggle.click();
    fixture.detectChanges();
    expect(getSampleResponseTexts()).toEqual(['"Sample response 1"']);
    expect(toggle.textContent.trim()).toEqual('Hide sample responses');

    toggle.click();
    fixture.detectChanges();
    expect(getSampleResponseTexts()).toEqual([]);
  });

  function setRubricWithSampleResponses(): void {
    component['rubric'] = new CRaterRubric({
      description: '',
      ideas: [
        { name: '1', text: 'Idea 1', sampleResponses: ['Sample response 1', ''] },
        { name: '2', text: 'Idea 2', sampleResponses: [''] }
      ]
    });
    component.ngOnInit();
    fixture.detectChanges();
  }

  function getSampleResponseTexts(): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.sample-responses div')).map(
      (div: HTMLElement) => div.textContent.trim()
    );
  }
});
