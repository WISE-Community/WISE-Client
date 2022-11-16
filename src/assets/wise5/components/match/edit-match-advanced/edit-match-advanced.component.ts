import { Component } from '@angular/core';
import { EditAdvancedComponentComponent } from '../../../../../app/authoring-tool/edit-advanced-component/edit-advanced-component.component';
import { MatchContent } from '../MatchContent';

@Component({
  selector: 'edit-match-advanced',
  templateUrl: 'edit-match-advanced.component.html',
  styleUrls: ['edit-match-advanced.component.scss']
})
export class EditMatchAdvancedComponent extends EditAdvancedComponentComponent {
  allowedConnectedComponentTypes = ['Match'];
  componentContent: MatchContent;
}
