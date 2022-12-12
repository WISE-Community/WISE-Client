import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassroomMonitorTestingModule } from '../../../classroom-monitor-testing.module';

import { NotebookWorkgroupGradingComponent } from './notebook-workgroup-grading.component';

let component: NotebookWorkgroupGradingComponent;
let fixture: ComponentFixture<NotebookWorkgroupGradingComponent>;
const workgroupId = 100;

describe('NotebookWorkgroupGradingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotebookWorkgroupGradingComponent],
      imports: [ClassroomMonitorTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookWorkgroupGradingComponent);
    component = fixture.componentInstance;
    component.workgroup = {
      workgroupId: workgroupId
    };
    fixture.detectChanges();
  });

  toggleExpand();
  getNumActiveNotes();
});

function toggleExpand() {
  it('should toggle expand to true', () => {
    testToggleExpand(false, true);
  });
  it('should toggle expand to false', () => {
    testToggleExpand(true, false);
  });
}

function testToggleExpand(expandValueBefore: boolean, expandValueAfter: boolean) {
  component.expand = expandValueBefore;
  const onUpdateExpandSpy = spyOn(component.onUpdateExpand, 'emit');
  component.toggleExpand();
  expect(onUpdateExpandSpy).toHaveBeenCalledWith({
    workgroupId: workgroupId,
    isExpanded: expandValueAfter
  });
}

function getNumActiveNotes() {
  it('should get num active notes', () => {
    component.workgroup = {
      notes: [{ serverDeleteTime: 1661894955685 }, {}]
    };
    expect(component.getNumActiveNotes()).toEqual(1);
  });
}
