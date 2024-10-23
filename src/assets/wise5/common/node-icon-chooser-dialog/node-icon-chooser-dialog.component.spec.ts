import { NodeIconChooserDialogComponent } from './node-icon-chooser-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestBed } from '@angular/core/testing';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { Node } from '../Node';
import { provideRouter } from '@angular/router';

const node1 = {
  id: 'node1',
  icon: {
    type: 'img',
    imgAlt: 'KI connect ideas',
    imgSrc: 'assets/img/icons/ki-color-connect.svg'
  }
};

const elicitKIIcon = {
  selected: true,
  source: {
    value: {
      imgAlt: 'KI elicit ideas',
      imgSrc: 'assets/img/icons/ki-color-elicit.svg'
    }
  }
};

const schoolIcon = {
  selected: true,
  source: {
    value: 'school'
  }
};

class MockProjectService {
  getNodeById() {
    return node1;
  }
  saveProject() {}
}

let fixture;
let component;
fdescribe('NodeIconChooserDialog', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NodeIconChooserDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: TeacherProjectService, useClass: MockProjectService },
        provideRouter([])
      ]
    });
    fixture = TestBed.createComponent(NodeIconChooserDialogComponent);
    component = fixture.componentInstance;
    component.node = Object.assign(new Node(), node1);
    component.newNodeIcon = node1.icon;
  });
  chooseFontName();
  chooseKIIcon();
  save();
});

function chooseFontName() {
  describe('chooseFontName()', () => {
    it('should set type to font and set fontname', () => {
      component.chooseFontName(schoolIcon);
      expect(component.newNodeIcon.type).toEqual('font');
      expect(component.newNodeIcon.fontName).toEqual('school');
    });
  });
}

function chooseKIIcon() {
  describe('chooseKIIcon()', () => {
    it('should set type to image and set imgAlt and imgSrc', () => {
      component.chooseKIIcon(elicitKIIcon);
      expect(component.newNodeIcon.type).toEqual('img');
      expect(component.newNodeIcon.imgAlt).toEqual('KI elicit ideas');
      expect(component.newNodeIcon.imgSrc).toEqual('assets/img/icons/ki-color-elicit.svg');
    });
  });
}

function save() {
  describe('save()', () => {
    it('should update node content and save', () => {
      spyOn(TestBed.inject(TeacherProjectService), 'getNodeById').and.callThrough();
      spyOn(TestBed.inject(TeacherProjectService), 'saveProject').and.callThrough();
      spyOn(component.dialogRef, 'close').and.callThrough();
      component.save();
      expect(TestBed.inject(TeacherProjectService).getNodeById).toHaveBeenCalledWith('node1');
      expect(TestBed.inject(TeacherProjectService).saveProject).toHaveBeenCalled();
      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });
}
