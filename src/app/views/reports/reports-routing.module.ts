import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InserviceVsSpareComponent } from '../reports/inserviceVsSpare/inservice-vs-spare.component';
import { serviceReportsComponent } from './serviceReports/servicereports.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Reports',
    },
    children: [
      {
        path: '',
        redirectTo: 'inservicevsspare',
        pathMatch: 'full',
      },
      {
        path: 'inservicevsspare',
        component: InserviceVsSpareComponent,
        data: {
          title: 'inservicevsspare',
        },
      },

      {
        path: 'servicereports',
        component: serviceReportsComponent,
        data: {
          title: 'serviceReports',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
