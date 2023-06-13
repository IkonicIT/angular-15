import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FailuretypemanagementComponent } from './failuretypemanagement/failuretypemanagement.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'failuretype',
    },
    children: [
      {
        path: '',
        redirectTo: 'itemfailuretype',
        pathMatch: 'full',
      },
      {
        path: 'itemfailuretype',
        component: FailuretypemanagementComponent,
        data: {
          title: 'failure type',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FailureTypeRoutingModule {}
