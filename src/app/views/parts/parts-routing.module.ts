import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartsComponent } from './manage-parts/parts.component';
import { EditPartComponent } from './edit-parts/edit-parts.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'parts',
    },
    children: [
      {
        path: '',
        redirectTo: 'parts',
        pathMatch: 'full',
      },
      {
        path: 'parts/:frame',
        component: PartsComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'parts',
        component: PartsComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'edit/:id/:frame',
        component: EditPartComponent,
        data: {
          title: '',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartsRoutingModule {}
