import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CranesComponent } from './manage-cranes/cranes.component';
import { EditCranesComponent } from './edit-cranes/edit-cranes.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cranes',
    pathMatch: 'full',
  },
  {
    path: 'cranes',
    component: CranesComponent,
  },
  {
    path: 'editCrane/:id',
    component: EditCranesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CranesRoutingModule {}
