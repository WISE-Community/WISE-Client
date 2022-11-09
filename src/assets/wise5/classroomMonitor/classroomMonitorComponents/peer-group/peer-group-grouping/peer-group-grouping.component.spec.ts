import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ConfigService } from '../../../../services/configService';
import { UtilService } from '../../../../services/utilService';

import { PeerGroupGroupingComponent } from './peer-group-grouping.component';

describe('PeerGroupGroupingComponent', () => {
  let component: PeerGroupGroupingComponent;
  let container1: any;
  let container2: any;
  let fixture: ComponentFixture<PeerGroupGroupingComponent>;
  let dialogOpenSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeerGroupGroupingComponent],
      imports: [
        BrowserAnimationsModule,
        DragDropModule,
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule
      ],
      providers: [ConfigService, UtilService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerGroupGroupingComponent);
    spyOn(TestBed.inject(ConfigService), 'getAvatarColorForWorkgroupId').and.returnValue('#E91E63');
    container1 = createContainer(1);
    container2 = createContainer(2);
    component = fixture.componentInstance;
    component.grouping = { id: 1 };
    dialogOpenSpy = spyOn(TestBed.inject(MatDialog), 'open');
    fixture.detectChanges();
  });

  function createEvent(workgroupId: number, previousContainer: any, container: any): any {
    return {
      container: container,
      item: {
        data: workgroupId
      },
      previousContainer: previousContainer
    };
  }

  function createContainer(id: number): any {
    return {
      data: {
        id: id
      },
      element: {
        nativeElement: {
          classList: createClassList('primary-bg')
        }
      }
    };
  }

  function createClassList(className: string): any {
    const dummyDiv = document.createElement('div');
    const classList = dummyDiv.classList;
    classList.add(className);
    return classList;
  }

  it('should drop workgroup onto same container it came from', () => {
    const event = createEvent(1, container1, container1);
    component.dropWorkgroup(event);
    expect(dialogOpenSpy).not.toHaveBeenCalled();
  });

  it('should drop workgroup onto different container', () => {
    dialogOpenSpy.and.callThrough();
    const event = createEvent(1, container1, container2);
    component.dropWorkgroup(event);
    expect(dialogOpenSpy).toHaveBeenCalled();
  });

  it('should drop workgroup onto different container and cancel move', () => {
    dropWorkgroupAndRespond(false);
  });

  it('should drop workgroup onto different container and confirm move', () => {
    dropWorkgroupAndRespond(true);
  });

  function dropWorkgroupAndRespond(confirmResponse: boolean): void {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(confirmResponse), close: null });
    const dialogOpenConfirmSpy = dialogOpenSpy.and.returnValue(dialogRefSpyObj);
    const event = createEvent(1, container1, container2);
    const emitSpy = spyOn(component.moveWorkgroup, 'emit');
    expect(container2.element.nativeElement.classList.contains('primary-bg')).toBeTruthy();
    component.dropWorkgroup(event);
    expect(dialogOpenConfirmSpy).toHaveBeenCalled();
    if (confirmResponse) {
      expect(emitSpy).toHaveBeenCalled();
    } else {
      expect(emitSpy).not.toHaveBeenCalled();
    }
    expect(container2.element.nativeElement.classList.contains('primary-bg')).toBeFalsy();
  }
});
