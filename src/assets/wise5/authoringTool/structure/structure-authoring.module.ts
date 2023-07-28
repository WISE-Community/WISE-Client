import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { JigsawComponent } from './jigsaw/jigsaw.component';
import { SelfDirectedInvestigationComponent } from './self-directed-investigation/self-directed-investigation.component';
import { KiCycleUsingOerComponent } from './ki-cycle-using-oer/ki-cycle-using-oer.component';
import { PeerReviewAndRevisionComponent } from './peer-review-and-revision/peer-review-and-revision.component';
import { ChooseStructureComponent } from './choose-structure/choose-structure.component';
import { ChooseStructureLocationComponent } from './choose-structure-location/choose-structure-location.component';

@NgModule({
  declarations: [
    ChooseStructureComponent,
    ChooseStructureLocationComponent,
    JigsawComponent,
    KiCycleUsingOerComponent,
    PeerReviewAndRevisionComponent,
    SelfDirectedInvestigationComponent
  ],
  imports: [StudentTeacherCommonModule],
  exports: [
    ChooseStructureComponent,
    ChooseStructureLocationComponent,
    JigsawComponent,
    KiCycleUsingOerComponent,
    PeerReviewAndRevisionComponent,
    SelfDirectedInvestigationComponent
  ]
})
export class StructureAuthoringModule {}
