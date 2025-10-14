import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { CRaterService } from '../../../../services/cRaterService';
import { TeacherProjectService } from '../../../../services/teacherProjectService';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, MatFormFieldModule, MatSelect, MatOption],
  selector: 'c-rater-item-select',
  templateUrl: './crater-item-select.component.html'
})
export class CRaterItemSelectComponent {
  @Input() componentContent: any;
  protected itemIds = [
    'berkeley_BowlsInAFridge',
    'berkeley_CarOnAColdDay',
    'berkeley_COAL-II',
    'berkeley_CovidImpacts',
    'berkeley_FoodJustice',
    'berkeley_FoodJusticeShortLabelIdeaKI',
    'berkeley_GenEx-Siblings',
    'berkeley_HeLa',
    'berkeley_Impacts',
    'berkeley_Lizards',
    'berkeley_MusicalInstruments-Speed',
    'berkeley_PhotoEnergyStory',
    'berkeley_PlateTectonics_MtHood',
    'berkeley_SPOON-II'
  ];
  protected selectedItemId: string;

  constructor(
    private cRaterService: CRaterService,
    private projectService: TeacherProjectService
  ) {}

  ngOnInit(): void {
    if (this.componentContent.type === 'OpenResponse') {
      this.selectedItemId = this.componentContent.cRater.itemId;
    } else if (this.componentContent.type === 'DialogGuidance') {
      this.selectedItemId = this.componentContent.itemId;
    }
  }

  protected getItemRubric(): void {
    this.cRaterService.makeCRaterVerifyRequest(this.selectedItemId).subscribe((response) => {
      const cRaterRubric = response.rubric ?? { description: '', ideas: [] };
      if (this.componentContent.type === 'OpenResponse') {
        this.componentContent.cRater.rubric = cRaterRubric;
        this.componentContent.cRater.itemId = this.selectedItemId;
      } else if (this.componentContent.type === 'DialogGuidance') {
        this.componentContent.cRaterRubric = cRaterRubric;
        this.componentContent.itemId = this.selectedItemId;
      }
      this.projectService.saveProject();
    });
  }
}
