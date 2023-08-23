import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseStructureLocationComponent } from './choose-structure-location/choose-structure-location.component';
import { ChooseStructureComponent } from './choose-structure/choose-structure.component';
import { JigsawComponent } from './jigsaw/jigsaw.component';
import { SelfDirectedInvestigationComponent } from './self-directed-investigation/self-directed-investigation.component';
import { KiCycleUsingOerComponent } from './ki-cycle-using-oer/ki-cycle-using-oer.component';
import { PeerReviewAndRevisionComponent } from './peer-review-and-revision/peer-review-and-revision.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'choose',
        component: ChooseStructureComponent
      },
      {
        path: 'jigsaw',
        component: JigsawComponent
      },
      { path: 'ki-cycle-using-oer', component: KiCycleUsingOerComponent },
      {
        path: 'location',
        component: ChooseStructureLocationComponent
      },
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
