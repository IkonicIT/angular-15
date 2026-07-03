import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateComponent } from "./masterpiecharts.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'masterpiecharts',
    pathMatch: 'full'
  },
  {
    path: 'masterpiecharts',
    component: TemplateComponent,
  },
  {
    path: 'editCrane/:id',
    component: TemplateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
