import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpComponent } from './help.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'help',
    },
    children: [
      {
        path: '',
        redirectTo: 'help',
        pathMatch: 'full',
      },
      {
        path: 'help',
        component: HelpComponent,
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
export class HelpRoutingModule {}
