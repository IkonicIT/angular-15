import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateComponent } from './template.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'template',
    },
    children: [
      {
        path: '',
        redirectTo: 'template',
        pathMatch: 'full',
      },
      {
        path: 'template',
        component: TemplateComponent,
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
export class TemplateRoutingModule {}
