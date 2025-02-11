import { Component, Input } from '@angular/core';
import { CRaterIdea } from '../../common/cRater/CRaterIdea';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';

@Component({
  selector: 'edit-dialog-guidance-advanced',
  templateUrl: 'edit-dialog-guidance-advanced.component.html'
})
export class EditDialogGuidanceAdvancedComponent extends EditAdvancedComponentComponent {
  @Input() ideaDescriptions: CRaterIdea[] = [];
}
