import { Component, Input } from '@angular/core';
import { CRaterRubric } from '../../common/cRater/CRaterRubric';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';

@Component({
  selector: 'edit-dialog-guidance-advanced',
  templateUrl: 'edit-dialog-guidance-advanced.component.html',
  standalone: false
})
export class EditDialogGuidanceAdvancedComponent extends EditAdvancedComponentComponent {
  @Input() cRaterRubric: CRaterRubric;
}
