import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { ConfigService } from '../../../assets/wise5/services/configService';
import { SessionService } from '../../../assets/wise5/services/sessionService';
import { TeacherProjectService } from '../../../assets/wise5/services/teacherProjectService';
import { UtilService } from '../../../assets/wise5/services/utilService';
import { EditComponentPeerGroupActivityTagComponent } from './edit-component-peer-group-activity-tag.component';

describe('EditComponentPeerGroupActivityTagComponent', () => {
  let component: EditComponentPeerGroupActivityTagComponent;
  const component1 = createComponent('cookie');
  const component2 = createComponent('apple');
  const component3 = createComponent('banana');
  const component4 = createComponent('apple');
  const components = [component1, component2, component3, component4];
  let componentChangedSpy: jasmine.Spy;
  let fixture: ComponentFixture<EditComponentPeerGroupActivityTagComponent>;
  let getComponentsSpy: jasmine.Spy;
  const newTag = 'green';
  const oldTag = 'blue';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        UpgradeModule
      ],
      declarations: [EditComponentPeerGroupActivityTagComponent],
      providers: [ConfigService, SessionService, TeacherProjectService, UtilService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponentPeerGroupActivityTagComponent);
    component = fixture.componentInstance;
    component.authoringComponentContent = {};
    getComponentsSpy = spyOn(TestBed.inject(TeacherProjectService), 'getComponents');
    getComponentsSpy.and.returnValue(components);
    componentChangedSpy = spyOn(TestBed.inject(TeacherProjectService), 'componentChanged');
    fixture.detectChanges();
  });

  function createComponent(peerGroupActivityTag: string) {
    return {
      peerGroupActivityTag: peerGroupActivityTag
    };
  }

  it('should get peer group activity tags when there are none', () => {
    getComponentsSpy.and.returnValue([
      createComponent(''),
      createComponent(''),
      createComponent('')
    ]);
    const tags = component.getExistingPeerGroupActivityTags();
    expect(tags.length).toEqual(0);
  });

  it('should get peer group activity tags that are unique and sorted alphabetically', () => {
    const tags = component.getExistingPeerGroupActivityTags();
    expect(tags.length).toEqual(3);
    expect(tags[0]).toEqual(component2.peerGroupActivityTag);
    expect(tags[1]).toEqual(component3.peerGroupActivityTag);
    expect(tags[2]).toEqual(component1.peerGroupActivityTag);
  });

  it('should edit', () => {
    expect(component.tagControl.disabled).toEqual(true);
    expect(component.tagInput.nativeElement).not.toEqual(document.activeElement);
    component.edit();
    expect(component.tagControl.disabled).toEqual(false);
    expect(component.tagInput.nativeElement).toEqual(document.activeElement);
  });

  it('should save', () => {
    component.authoringComponentContent.peerGroupActivityTag = oldTag;
    component.tagControl.setValue(newTag);
    component.save();
    expect(component.authoringComponentContent.peerGroupActivityTag).toEqual(newTag);
    expect(componentChangedSpy).toHaveBeenCalled();
    expect(component.tagControl.disabled).toEqual(true);
  });

  it('should cancel', () => {
    component.authoringComponentContent.peerGroupActivityTag = oldTag;
    component.tagControl.setValue(newTag);
    component.cancel();
    expect(component.authoringComponentContent.peerGroupActivityTag).toEqual(oldTag);
    expect(componentChangedSpy).not.toHaveBeenCalled();
    expect(component.tagControl.disabled).toEqual(true);
  });
});
