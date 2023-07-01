import { NgModule } from '@angular/core';
import { StudentTeacherCommonModule } from '../../../../app/student-teacher-common.module';
import { JigsawComponent } from './jigsaw/jigsaw.component';
import { SelfDirectedInvestigationComponent } from './self-directed-investigation/self-directed-investigation.component';
import { KiCycleUsingOerComponent } from './ki-cycle-using-oer/ki-cycle-using-oer.component';
import { PeerReviewAndRevisionComponent } from './peer-review-and-revision/peer-review-and-revision.component';

@NgModule({
  declarations: [
    JigsawComponent,
    KiCycleUsingOerComponent,
    PeerReviewAndRevisionComponent,
    SelfDirectedInvestigationComponent
  ],
  imports: [StudentTeacherCommonModule]
})
export class StructureAuthoringModule {}
