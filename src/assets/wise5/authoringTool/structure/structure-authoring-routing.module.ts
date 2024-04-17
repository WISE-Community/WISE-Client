import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JigsawComponent } from './jigsaw/jigsaw.component';
import { SelfDirectedInvestigationComponent } from './self-directed-investigation/self-directed-investigation.component';
import { KiCycleUsingOerComponent } from './ki-cycle-using-oer/ki-cycle-using-oer.component';
import { PeerReviewAndRevisionComponent } from './peer-review-and-revision/peer-review-and-revision.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'jigsaw', component: JigsawComponent },
      { path: 'ki-cycle-using-oer', component: KiCycleUsingOerComponent },
      { path: 'peer-review-and-revision', component: PeerReviewAndRevisionComponent },
      { path: 'self-directed-investigation', component: SelfDirectedInvestigationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructureAuthoringRoutingModule {}
